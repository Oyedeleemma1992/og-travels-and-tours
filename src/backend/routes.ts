import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

const router = Router();

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Database helper
const getDbPath = (name: string) => path.join(process.cwd(), 'data', `${name}.json`);

const readDb = (name: string) => {
  const dbPath = getDbPath(name);
  if (fs.existsSync(dbPath)) {
    try {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
};

const writeDb = (name: string, data: any) => {
  const dbPath = getDbPath(name);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Seed initial data if empty
const seedData = () => {
  const vacationsDb = readDb('vacations');
  if (vacationsDb.length === 0) {
    // Initial mock data from frontend
    const initialVacations = [
      {
        id: 'pkg-zanzibar',
        title: 'Zanzibar Island Retreat',
        destination: 'Zanzibar',
        image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop'
        ],
        overview: 'Experience the pristine beaches and rich culture of Zanzibar.',
        price: '$1,200',
      },
      {
        id: 'pkg-dubai',
        title: 'Dubai Luxury Escape',
        destination: 'Dubai',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
        ],
        overview: 'Discover the futuristic skyline and luxurious lifestyle of Dubai.',
        price: '$1,500',
      },
      {
        id: 'pkg-egypt',
        title: 'Mysteries of Egypt',
        destination: 'Egypt',
        image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1000&auto=format&fit=crop'
        ],
        overview: 'Uncover the ancient secrets of the pharaohs and cruise the Nile.',
        price: '$1,750',
      },
      {
        id: 'pkg-skorea',
        title: 'South Korea Cultural Tour',
        destination: 'South Korea',
        image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop'
        ],
        overview: 'Immerse yourself in the vibrant culture and history of South Korea.',
        price: '$2,100',
      },
      {
        id: 'pkg-qatar',
        title: 'Discover Qatar',
        destination: 'Qatar',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Doha_Skyline_Nacht_night.jpg',
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/1/16/Doha_Skyline_Nacht_night.jpg'
        ],
        overview: 'Explore the modern marvels and traditional souqs of Doha.',
        price: '$1,800',
      },
      {
        id: 'pkg-china',
        title: 'Wonders of China',
        destination: 'China',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000&auto=format&fit=crop'
        ],
        overview: 'Journey through the ancient history and breathtaking landscapes of China.',
        price: '$2,500',
      },
      {
        id: 'pkg-canton',
        title: 'China Canton Fair Business Trip',
        destination: 'Guangzhou, China',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pazhou_Station_Platform_1_202011.jpg',
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pazhou_Station_Platform_1_202011.jpg'
        ],
        overview: 'All-inclusive travel package for the China Import and Export Fair.',
        price: '$2,800',
      }
    ];
    writeDb('vacations', initialVacations);
  }
};
seedData();

// --- Blogs ---

router.get('/blogs', (req, res) => {
  res.json(readDb('blogs'));
});

router.post('/blogs', upload.single('image'), (req, res) => {
  const blogs = readDb('blogs');
  const newBlog = {
    id: 'blog-' + Date.now(),
    title: req.body.title,
    excerpt: req.body.excerpt || '',
    content: req.body.content,
    author: req.body.author || 'Kayode Oyedele',
    date: new Date().toISOString(),
    status: 'published',
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
  };
  blogs.unshift(newBlog);
  writeDb('blogs', blogs);
  res.status(201).json(newBlog);
});

router.put('/blogs/:id', upload.single('image'), (req, res) => {
  const blogs = readDb('blogs');
  const index = blogs.findIndex((b: any) => b.id === req.params.id || b._id === req.params.id);
  if (index !== -1) {
    const updatedBlog = {
      ...blogs[index],
      title: req.body.title || blogs[index].title,
      excerpt: req.body.excerpt !== undefined ? req.body.excerpt : blogs[index].excerpt,
      content: req.body.content || blogs[index].content,
      author: req.body.author || blogs[index].author,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : blogs[index].imageUrl
    };
    blogs[index] = updatedBlog;
    writeDb('blogs', blogs);
    res.json(updatedBlog);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

router.delete('/blogs/:id', (req, res) => {
  let blogs = readDb('blogs');
  blogs = blogs.filter((b: any) => b.id !== req.params.id && b._id !== req.params.id);
  writeDb('blogs', blogs);
  res.json({ success: true });
});

// --- Vacations ---

router.get('/vacations', (req, res) => {
  res.json(readDb('vacations'));
});

router.post('/vacations/update', upload.array('images'), (req, res) => {
  const vacations = readDb('vacations');
  const isUpdate = !!req.body.id;
  const id = isUpdate ? req.body.id : 'pkg-' + Date.now();

  const newImages = (req.files as Express.Multer.File[] || []).map(f => `/uploads/${f.filename}`);

  if (isUpdate) {
    const index = vacations.findIndex((v: any) => v.id === id || v._id === id);
    if (index !== -1) {
      const existing = vacations[index];
      const updatedImages = newImages.length > 0 ? [...newImages, ...(existing.images || [])] : existing.images;
      
      vacations[index] = {
        ...existing,
        title: req.body.title || existing.title,
        destination: req.body.destination || existing.destination,
        overview: req.body.description || existing.overview, // API receives 'description' from form
        price: req.body.price || existing.price,
        images: updatedImages,
        image: updatedImages && updatedImages.length > 0 ? updatedImages[0] : existing.image
      };
      writeDb('vacations', vacations);
      return res.json(vacations[index]);
    }
  }

  // Create new
  const newVacation = {
    id,
    title: req.body.title,
    destination: req.body.destination,
    overview: req.body.description,
    price: req.body.price,
    images: newImages,
    image: newImages.length > 0 ? newImages[0] : ''
  };
  vacations.unshift(newVacation);
  writeDb('vacations', vacations);
  res.status(201).json(newVacation);
});

router.delete('/vacations/:id', (req, res) => {
  let vacations = readDb('vacations');
  vacations = vacations.filter((v: any) => v.id !== req.params.id && v._id !== req.params.id);
  writeDb('vacations', vacations);
  res.json({ success: true });
});


// --- FX-PORT FLIGHTS API ---
const FXP_BASE_URL = "https://api.fx-port.com";

router.post('/flights/search', async (req, res) => {
  try {
    const apiKey = process.env.FXP_API_KEY;
    if (!apiKey) throw new Error("FXP_API_KEY is missing from .env");

    const payload = req.body.searchParams || req.body;
    console.log("[FX-PORT PROXY] Live flight search");
    const response = await fetch(`${FXP_BASE_URL}/api/v1/get_flights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("[FX-PORT Search Error]:", error.message);
    return res.status(502).json({ success: false, message: "Live flight search failed.", error: error.message });
  }
});

router.post('/flights/price_flight', async (req, res) => {
  try {
    const apiKey = process.env.FXP_API_KEY;
    if (!apiKey) throw new Error("FXP_API_KEY is missing from .env");

    const response = await fetch(`${FXP_BASE_URL}/api/v1/flights/price_flight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("[FX-PORT Price Error]:", error.message);
    return res.status(502).json({ success: false, message: "Live pricing failed.", error: error.message });
  }
});

router.post('/flights/book', async (req, res) => {
  try {
    const apiKey = process.env.FXP_API_KEY;
    if (!apiKey) throw new Error("FXP_API_KEY is missing from .env");

    const payload = {
      ...req.body,
      booking_type: "issue"
    };

    const response = await fetch(`${FXP_BASE_URL}/api/v1/flights/book_flight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("[FX-PORT Book Error]:", error.message);
    return res.status(502).json({ success: false, message: "Live booking failed.", error: error.message });
  }
});

export default router;

// --- FX-PORT WEBHOOK LISTENER ---
router.post('/webhooks/fxport', (req, res) => {
  try {
    const signature = req.headers['x-fxport-signature'] || req.headers['x-signature'];
    const webhookSecret = process.env.FXP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook Error]: FXP_WEBHOOK_SECRET is not configured.");
      return res.status(500).send("Webhook secret not configured.");
    }

    if (signature) {
      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error("[Webhook Error]: Invalid signature.");
        return res.status(401).send("Invalid signature.");
      }
    }

    const payload = req.body;
    console.log("[Webhook Received]:", payload.event || "Unknown event", payload);

    // Handle booking confirmations, ticket issuances, etc.
    if (payload.event === 'flight.ticketed') {
      // Update local database or notify user
      console.log(`Ticket issued for PNR: ${payload.data?.pnr}`);
    }

    res.status(200).send("Webhook received");
  } catch (error: any) {
    console.error("[Webhook Exception]:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// --- PAYSTACK VERIFY & ITINERARY PDF GENERATION ---
const sendItineraryEmail = async (pdfBuffer: Buffer, userEmail: string, adminEmail: string, passengerName: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  const mailOptions = {
    from: `"OG Travels & Tours" <${process.env.SMTP_USER}>`,
    to: userEmail,
    bcc: adminEmail,
    subject: `Your Custom Flight Itinerary - ${passengerName}`,
    text: `Dear ${passengerName},\n\nThank you for choosing OG Travels & Tours. Please find your requested custom flight itinerary attached.\n\nBest Regards,\nOG Travels Team`,
    attachments: [
      {
        filename: 'Flight_Itinerary.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

const generateItineraryPDF = (flightData: any, passenger: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('OG Travels & Tours', { align: 'center' });
      doc.fontSize(12).text('Custom Flight Itinerary', { align: 'center' });
      doc.moveDown(2);

      // Passenger Info
      doc.fontSize(14).text('Passenger Information', { underline: true });
      doc.fontSize(12).text(`Name: ${passenger.firstName} ${passenger.lastName}`);
      doc.text(`Email: ${passenger.email}`);
      doc.text(`Phone: ${passenger.phone}`);
      doc.moveDown();

      // Flight Details
      doc.fontSize(14).text('Flight Details', { underline: true });
      doc.fontSize(12);
      
      const airline = flightData.airline || flightData.owner?.name || 'Unknown Airline';
      doc.text(`Airline: ${airline}`);
      
      if (flightData.slices && flightData.slices.length > 0) {
        flightData.slices.forEach((slice: any, index: number) => {
          doc.moveDown();
          doc.text(`Slice ${index + 1}:`, { underline: true });
          doc.text(`Departure: ${slice.origin_name || slice.origin?.name} (${slice.origin?.iata_code}) - ${new Date(slice.departure_time).toLocaleString()}`);
          doc.text(`Arrival: ${slice.destination_name || slice.destination?.name} (${slice.destination?.iata_code}) - ${new Date(slice.arrival_time).toLocaleString()}`);
          doc.text(`Duration: ${slice.duration || 'N/A'}`);
        });
      } else {
         doc.text(`Itinerary: ${flightData.title || 'Selected Flight'}`);
      }
      
      doc.moveDown(2);
      doc.fillColor('grey').fontSize(10).text('Thank you for booking with OG Travels & Tours. This is a generated itinerary and does not constitute a confirmed ticket until full payment is received for the live booking.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

router.get('/paystack/callback', async (req, res) => {
  try {
    const { reference, trxref } = req.query;
    const ref = (reference || trxref) as string;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey || !ref) throw new Error("Missing parameters or secret key");

    // Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return res.redirect('/?payment=failed');
    }

    // Verify amount (10000 NGN = 1000000 kobo)
    if (verifyData.data.amount < 1000000) {
      return res.redirect('/?payment=invalid_amount');
    }

    // Get transaction data
    const transactions = readDb('transactions');
    const tx = transactions.find((t: any) => t.reference === ref);

    if (!tx || tx.status === 'processed') {
       // Already processed or not found
       return res.redirect('/?payment=success');
    }

    const { flightData, passenger } = tx;

    // Generate PDF
    const pdfBuffer = await generateItineraryPDF(flightData, passenger);

    // Send Email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'info@ogtravelsandtours.com';
    try {
      await sendItineraryEmail(pdfBuffer, passenger.email, adminEmail, `${passenger.firstName} ${passenger.lastName}`);
    } catch (emailErr) {
      console.error("[Email Error]:", emailErr);
    }

    // Mark processed
    tx.status = 'processed';
    writeDb('transactions', transactions);

    // Redirect to success
    res.redirect('/?payment=success');
  } catch (error: any) {
    console.error("[Itinerary Generation Error]:", error.message);
    res.redirect('/?payment=error');
  }
});


router.post('/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, metadata, flightData, passenger } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!secretKey) throw new Error("Paystack secret key is missing");

    const reference = `ITIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // Save pending transaction
    const transactions = readDb('transactions');
    transactions.push({
      reference,
      flightData,
      passenger,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    writeDb('transactions', transactions);
    
    // The callback_url will route back to our backend
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    const callbackUrl = `${protocol}://${host}/api/v1/paystack/callback`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        callback_url: callbackUrl,
        metadata
      })
    });
    
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("[Paystack Initialize Error]:", error.message);
    res.status(500).json({ success: false, message: "Payment initialization failed", error: error.message });
  }
});
