const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from the server images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Paths to JSON files and images - all relative to server directory
const DATA_DIR = path.join(__dirname, 'data');
const IMAGES_DIR = path.join(__dirname, 'images');
const FRAMES_FILE = path.join(__dirname, 'data', 'frames.json');
const SUNGLASSES_FILE = path.join(__dirname, 'data', 'sunglasses.json');
const COMPANY_FILE = path.join(__dirname, 'data', 'company.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');
const INQUIRIES_FILE = path.join(__dirname, 'data', 'inquiries.json');

// Ensure data and image directories exist
async function ensureDirectories() {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  // Create image directories
  const framesImageDir = path.join(IMAGES_DIR, 'frames');
  const sunglassesImageDir = path.join(IMAGES_DIR, 'sunglasses');
  const companyImageDir = path.join(IMAGES_DIR, 'company');
  
  try {
    await fs.access(framesImageDir);
  } catch (error) {
    await fs.mkdir(framesImageDir, { recursive: true });
  }
  
  try {
    await fs.access(sunglassesImageDir);
  } catch (error) {
    await fs.mkdir(sunglassesImageDir, { recursive: true });
  }
  
  try {
    await fs.access(companyImageDir);
  } catch (error) {
    await fs.mkdir(companyImageDir, { recursive: true });
  }
}

// Generic function to read JSON file
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

// Generic function to write JSON file
async function writeJSONFile(filePath, data) {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf8');
    console.log(`✅ Successfully updated ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error);
    return false;
  }
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folder || 'frames';
    const uploadDir = path.join(IMAGES_DIR, folder);
    console.log(`🔍 Multer destination: ${uploadDir}`);
    console.log(`🔍 Directory exists check: ${require('fs').existsSync(uploadDir)}`);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename || `${Date.now()}_${file.originalname}`;
    console.log(`🔍 Multer filename: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes

// Image upload endpoint  
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = req.body.folder || 'frames';
    
    // Move file to correct folder if it was saved to wrong location
    const currentPath = req.file.path;
    const correctDir = path.join(IMAGES_DIR, folder);
    const correctPath = path.join(correctDir, req.file.filename);
    
    console.log(`🔍 Moving file from ${currentPath} to ${correctPath}`);
    
    // Ensure correct directory exists
    if (!require('fs').existsSync(correctDir)) {
      await require('fs').promises.mkdir(correctDir, { recursive: true });
    }
    
    // Move file to correct location
    if (currentPath !== correctPath) {
      await require('fs').promises.rename(currentPath, correctPath);
    }
    
    const relativePath = `/images/${folder}/${req.file.filename}`;
    
    console.log(`🖼️ Image uploaded successfully:`);
    console.log(`   - Original name: ${req.file.originalname}`);
    console.log(`   - Saved as: ${req.file.filename}`);
    console.log(`   - Folder: ${folder}`);
    console.log(`   - Path: ${relativePath}`);
    console.log(`   - Size: ${(req.file.size / 1024).toFixed(2)} KB`);

    res.json({
      success: true,
      path: relativePath,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image endpoint
app.delete('/api/delete-image', async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'No image path provided' });
    }
    
    console.log('🗑️ Delete image request:', imagePath);
    
    // Skip deletion for external URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('   - External URL - no deletion needed');
      return res.json({ success: true, message: 'External URL - no deletion needed' });
    }
    
    // Skip deletion for data URLs  
    if (imagePath.startsWith('data:')) {
      console.log('   - Data URL - no deletion needed');
      return res.json({ success: true, message: 'Data URL - no deletion needed' });
    }
    
    // Handle relative paths like "/images/team/filename.jpg"
    let fullPath;
    if (imagePath.startsWith('/images/')) {
      // Remove leading slash and construct full path using the correct public directory
      fullPath = path.join(__dirname, '..', 'public', imagePath.substring(1));
    } else {
      // Assume it's already a full path
      fullPath = imagePath;
    }
    
    console.log(`   - Attempting to delete: ${fullPath}`);
    
    // Check if file exists
    if (require('fs').existsSync(fullPath)) {
      await require('fs').promises.unlink(fullPath);
      console.log(`   ✅ File deleted successfully: ${fullPath}`);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      console.log(`   ⚠️ File not found: ${fullPath}`);
      res.json({ success: true, message: 'File not found (already deleted)' });
    }
    
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

// Get all frames
app.get('/api/frames', async (req, res) => {
  try {
    const frames = await readJSONFile(FRAMES_FILE);
    if (frames === null) {
      return res.status(500).json({ error: 'Failed to read frames data' });
    }
    res.json(frames);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save all frames
app.post('/api/frames', async (req, res) => {
  try {
    const frames = req.body;
    
    if (!Array.isArray(frames)) {
      return res.status(400).json({ error: 'Invalid data format. Expected array of frames.' });
    }

    const success = await writeJSONFile(FRAMES_FILE, frames);
    
    if (success) {
      console.log(`📊 Database Operation: Updated frames table with ${frames.length} records`);
      res.json({ 
        success: true, 
        message: 'Frames data updated successfully',
        count: frames.length 
      });
    } else {
      res.status(500).json({ error: 'Failed to save frames data' });
    }
  } catch (error) {
    console.error('Error saving frames:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sunglasses
app.get('/api/sunglasses', async (req, res) => {
  try {
    const sunglasses = await readJSONFile(SUNGLASSES_FILE);
    if (sunglasses === null) {
      return res.status(500).json({ error: 'Failed to read sunglasses data' });
    }
    res.json(sunglasses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save all sunglasses
app.post('/api/sunglasses', async (req, res) => {
  try {
    const sunglasses = req.body;
    
    if (!Array.isArray(sunglasses)) {
      return res.status(400).json({ error: 'Invalid data format. Expected array of sunglasses.' });
    }

    const success = await writeJSONFile(SUNGLASSES_FILE, sunglasses);
    
    if (success) {
      console.log(`📊 Database Operation: Updated sunglasses table with ${sunglasses.length} records`);
      res.json({ 
        success: true, 
        message: 'Sunglasses data updated successfully',
        count: sunglasses.length 
      });
    } else {
      res.status(500).json({ error: 'Failed to save sunglasses data' });
    }
  } catch (error) {
    console.error('Error saving sunglasses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get company data
app.get('/api/company', async (req, res) => {
  try {
    const company = await readJSONFile(COMPANY_FILE);
    if (company === null) {
      return res.status(500).json({ error: 'Failed to read company data' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save company data
app.post('/api/company', async (req, res) => {
  try {
    const company = req.body;
    
    if (!company || typeof company !== 'object') {
      return res.status(400).json({ error: 'Invalid data format. Expected company object.' });
    }

    const success = await writeJSONFile(COMPANY_FILE, company);
    
    if (success) {
      console.log('📊 Database Operation: Updated company table');
      res.json({ 
        success: true, 
        message: 'Company data updated successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to save company data' });
    }
  } catch (error) {
    console.error('Error saving company data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inquiry Management Routes

// Get all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await readJSONFile(INQUIRIES_FILE);
    if (inquiries === null) {
      return res.status(500).json({ error: 'Failed to read inquiries data' });
    }
    
    // Apply filters if provided
    const { status, priority, productType, assignedTo } = req.query;
    let filteredInquiries = inquiries;
    
    if (status) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.status === status);
    }
    if (priority) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.priority === priority);
    }
    if (productType) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.product.type === productType);
    }
    if (assignedTo) {
      filteredInquiries = filteredInquiries.filter(inquiry => inquiry.assignedTo === assignedTo);
    }
    
    res.json(filteredInquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const { customerInfo, product, message } = req.body;
    
    if (!customerInfo || !product || !message) {
      return res.status(400).json({ error: 'Missing required fields: customerInfo, product, message' });
    }
    
    // Read existing inquiries
    const inquiries = await readJSONFile(INQUIRIES_FILE) || [];
    
    // Create new inquiry
    const newInquiry = {
      id: `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerInfo,
      product,
      message,
      status: 'new',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to inquiries array
    inquiries.unshift(newInquiry); // Add to beginning for newest first
    
    // Save updated inquiries
    const success = await writeJSONFile(INQUIRIES_FILE, inquiries);
    
    if (success) {
      console.log(`📝 New inquiry created: ${newInquiry.id} from ${customerInfo.email}`);
      res.status(201).json({ 
        success: true, 
        message: 'Inquiry created successfully',
        inquiry: newInquiry
      });
    } else {
      res.status(500).json({ error: 'Failed to save inquiry' });
    }
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inquiry
app.put('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Read existing inquiries
    const inquiries = await readJSONFile(INQUIRIES_FILE) || [];
    
    // Find inquiry to update
    const inquiryIndex = inquiries.findIndex(inquiry => inquiry.id === id);
    
    if (inquiryIndex === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    // Update inquiry
    inquiries[inquiryIndex] = {
      ...inquiries[inquiryIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated inquiries
    const success = await writeJSONFile(INQUIRIES_FILE, inquiries);
    
    if (success) {
      console.log(`📝 Inquiry updated: ${id}`);
      res.json({ 
        success: true, 
        message: 'Inquiry updated successfully',
        inquiry: inquiries[inquiryIndex]
      });
    } else {
      res.status(500).json({ error: 'Failed to update inquiry' });
    }
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Read existing inquiries
    const inquiries = await readJSONFile(INQUIRIES_FILE) || [];
    
    // Find inquiry to delete
    const inquiryIndex = inquiries.findIndex(inquiry => inquiry.id === id);
    
    if (inquiryIndex === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    // Remove inquiry
    inquiries.splice(inquiryIndex, 1);
    
    // Save updated inquiries
    const success = await writeJSONFile(INQUIRIES_FILE, inquiries);
    
    if (success) {
      console.log(`🗑️ Inquiry deleted: ${id}`);
      res.json({ 
        success: true, 
        message: 'Inquiry deleted successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to delete inquiry' });
    }
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inquiry statistics
app.get('/api/inquiries/stats', async (req, res) => {
  try {
    const inquiries = await readJSONFile(INQUIRIES_FILE) || [];
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    
    const stats = {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'new').length,
      inProgress: inquiries.filter(i => i.status === 'in-progress').length,
      completed: inquiries.filter(i => i.status === 'completed').length,
      thisMonth: inquiries.filter(i => new Date(i.createdAt) >= startOfMonth).length,
      thisWeek: inquiries.filter(i => new Date(i.createdAt) >= startOfWeek).length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact Management Routes

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await readJSONFile(CONTACTS_FILE);
    if (contacts === null) {
      return res.status(500).json({ error: 'Failed to read contacts data' });
    }
    
    // Apply filters if provided
    const { status, priority, serviceInterest, assignedTo, source } = req.query;
    let filteredContacts = contacts;
    
    if (status) {
      filteredContacts = filteredContacts.filter(contact => contact.status === status);
    }
    if (priority) {
      filteredContacts = filteredContacts.filter(contact => contact.priority === priority);
    }
    if (serviceInterest) {
      filteredContacts = filteredContacts.filter(contact => contact.serviceInterest === serviceInterest);
    }
    if (assignedTo) {
      filteredContacts = filteredContacts.filter(contact => contact.assignedTo === assignedTo);
    }
    if (source) {
      filteredContacts = filteredContacts.filter(contact => contact.source === source);
    }
    
    res.json(filteredContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const contactData = req.body;
    
    if (!contactData.customerInfo || !contactData.message) {
      return res.status(400).json({ error: 'Missing required fields: customerInfo, message' });
    }
    
    // Read existing contacts
    const contacts = await readJSONFile(CONTACTS_FILE) || [];
    
    // Create new contact (ID should already be provided by frontend)
    const newContact = {
      ...contactData,
      createdAt: contactData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to contacts array
    contacts.unshift(newContact); // Add to beginning for newest first
    
    // Save updated contacts
    const success = await writeJSONFile(CONTACTS_FILE, contacts);
    
    if (success) {
      console.log(`📞 New contact created: ${newContact.id} from ${contactData.customerInfo.email}`);
      res.status(201).json({ 
        success: true, 
        message: 'Contact created successfully',
        contact: newContact
      });
    } else {
      res.status(500).json({ error: 'Failed to save contact' });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Read existing contacts
    const contacts = await readJSONFile(CONTACTS_FILE) || [];
    
    // Find contact to update
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Update contact
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated contacts
    const success = await writeJSONFile(CONTACTS_FILE, contacts);
    
    if (success) {
      console.log(`📞 Contact updated: ${id}`);
      res.json({ 
        success: true, 
        message: 'Contact updated successfully',
        contact: contacts[contactIndex]
      });
    } else {
      res.status(500).json({ error: 'Failed to update contact' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Read existing contacts
    const contacts = await readJSONFile(CONTACTS_FILE) || [];
    
    // Find contact to delete
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Remove contact
    contacts.splice(contactIndex, 1);
    
    // Save updated contacts
    const success = await writeJSONFile(CONTACTS_FILE, contacts);
    
    if (success) {
      console.log(`🗑️ Contact deleted: ${id}`);
      res.json({ 
        success: true, 
        message: 'Contact deleted successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact statistics
app.get('/api/contacts/stats', async (req, res) => {
  try {
    const contacts = await readJSONFile(CONTACTS_FILE) || [];
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    
    const stats = {
      total: contacts.length,
      new: contacts.filter(c => c.status === 'new').length,
      inProgress: contacts.filter(c => c.status === 'in-progress').length,
      completed: contacts.filter(c => c.status === 'completed').length,
      thisMonth: contacts.filter(c => new Date(c.createdAt) >= startOfMonth).length,
      thisWeek: contacts.filter(c => new Date(c.createdAt) >= startOfWeek).length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Optical Database API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
async function startServer() {
  await ensureDirectories();
  
  app.listen(PORT, () => {
    console.log('🚀 Optical Database API Server started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log('🔄 Ready to handle automatic JSON file updates');
    console.log('\n📋 Available endpoints:');
    console.log(`   GET  /api/frames       - Get all frames`);
    console.log(`   POST /api/frames       - Update frames database`);
    console.log(`   GET  /api/sunglasses   - Get all sunglasses`);
    console.log(`   POST /api/sunglasses   - Update sunglasses database`);
    console.log(`   GET  /api/company      - Get company data`);
    console.log(`   POST /api/company      - Update company database`);
    console.log(`   POST /api/upload-image - Upload image files`);
    console.log(`   GET  /api/inquiries    - Get all inquiries`);
    console.log(`   POST /api/inquiries    - Create new inquiry`);
    console.log(`   PUT  /api/inquiries/:id - Update inquiry`);
    console.log(`   DELETE /api/inquiries/:id - Delete inquiry`);
    console.log(`   GET  /api/inquiries/stats - Get inquiry statistics`);
    console.log(`   GET  /api/contacts     - Get all contacts`);
    console.log(`   POST /api/contacts     - Create new contact`);
    console.log(`   PUT  /api/contacts/:id - Update contact`);
    console.log(`   DELETE /api/contacts/:id - Delete contact`);
    console.log(`   GET  /api/contacts/stats - Get contact statistics`);
    console.log(`   GET  /api/health       - Health check`);
  });
}

startServer().catch(console.error);