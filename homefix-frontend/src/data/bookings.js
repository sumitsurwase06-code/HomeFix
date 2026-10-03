/**
 * Demo Bookings Data for HomeFix
 * Reflects separated booking status and payment status, itemized pricing structure,
 * and realistic full-lifecycle service requests.
 */

export const DEMO_BOOKINGS = [
  {
    id: 'HF-BK-8901',
    serviceId: 'plumbing',
    serviceName: 'Plumbing - Tap & Mixer Leakage',
    customer: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98711 22334',
    },
    technicianId: 'TECH-101',
    technicianName: 'Rajesh Kumar (Demo)',
    technicianAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    problemTitle: 'Severe tap leakage under kitchen sink',
    problemDescription: 'The hot & cold mixer pipe below the main kitchen sink is continuously dripping water and has pooled into the cabinet.',
    problemImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=80'
    ],
    address: {
      street: 'Flat 402, Sunshine Heights, Sector 62',
      locality: 'Indirapuram',
      city: 'Noida',
      postalCode: '201309',
      label: 'Home'
    },
    appointmentDate: '2026-10-05',
    appointmentTime: '10:00 AM - 12:00 PM',
    status: 'In Progress', // Requested | Accepted | Scheduled | On the Way | In Progress | Completed | Cancelled
    paymentStatus: 'Pending', // Pending | Paid | Refunded
    pricing: {
      visitingCharge: 199,
      repairLabor: 350,
      materialCharge: 220,
      customerTotal: 769,
      platformFee: 70,
      technicianPayout: 699,
    },
    createdAt: '2026-10-03T09:30:00Z',
    statusHistory: [
      { status: 'Requested', timestamp: '2026-10-03T09:30:00Z', note: 'Booking submitted by customer' },
      { status: 'Accepted', timestamp: '2026-10-03T10:15:00Z', note: 'Accepted by technician Rajesh Kumar' },
      { status: 'Scheduled', timestamp: '2026-10-03T10:15:00Z', note: 'Scheduled for Oct 5th morning slot' },
      { status: 'On the Way', timestamp: '2026-10-04T09:40:00Z', note: 'Technician left for customer site' },
      { status: 'In Progress', timestamp: '2026-10-04T10:05:00Z', note: 'Diagnosing leak and replacing Teflon seal' }
    ]
  },
  {
    id: 'HF-BK-8902',
    serviceId: 'electrical',
    serviceName: 'Electrical - MCB Tripping & Short Circuit',
    customer: {
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 98112 33445',
    },
    technicianId: 'TECH-102',
    technicianName: 'Amit Sharma (Demo)',
    technicianAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    problemTitle: 'Master Bedroom MCB trips when AC turns on',
    problemDescription: 'Frequent tripping at the distribution board whenever AC compressor starts. Suspecting high load or loose neutral wire.',
    problemImages: [],
    address: {
      street: 'Villa 12, Palm Meadows, Koramangala 4th Block',
      locality: 'Koramangala',
      city: 'Bengaluru',
      postalCode: '560034',
      label: 'Home'
    },
    appointmentDate: '2026-10-06',
    appointmentTime: '02:00 PM - 04:00 PM',
    status: 'Scheduled',
    paymentStatus: 'Pending',
    pricing: {
      visitingCharge: 199,
      repairLabor: 0, // Pending inspection
      materialCharge: 0,
      customerTotal: 199,
      platformFee: 20,
      technicianPayout: 179,
    },
    createdAt: '2026-10-03T14:10:00Z',
    statusHistory: [
      { status: 'Requested', timestamp: '2026-10-03T14:10:00Z', note: 'Booking submitted' },
      { status: 'Accepted', timestamp: '2026-10-03T15:00:00Z', note: 'Accepted by technician' },
      { status: 'Scheduled', timestamp: '2026-10-03T15:00:00Z', note: 'Confirmed for Oct 6 afternoon' }
    ]
  },
  {
    id: 'HF-BK-8903',
    serviceId: 'appliance-repair',
    serviceName: 'Appliance Repair - Washing Machine Drum Error',
    customer: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98711 22334',
    },
    technicianId: 'TECH-104',
    technicianName: 'Suresh Patel (Demo)',
    technicianAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    problemTitle: 'Front-load washer showing UE imbalance error',
    problemDescription: 'The drum rattles heavily during the spin cycle and stops halfway through the rinse step.',
    problemImages: [],
    address: {
      street: 'Flat 402, Sunshine Heights, Sector 62',
      locality: 'Indirapuram',
      city: 'Noida',
      postalCode: '201309',
      label: 'Home'
    },
    appointmentDate: '2026-10-01',
    appointmentTime: '11:00 AM - 01:00 PM',
    status: 'Completed',
    paymentStatus: 'Paid',
    pricing: {
      visitingCharge: 249,
      repairLabor: 450,
      materialCharge: 550, // Damper shock absorbers replaced
      customerTotal: 1249,
      platformFee: 125,
      technicianPayout: 1124,
    },
    createdAt: '2026-09-30T11:00:00Z',
    statusHistory: [
      { status: 'Requested', timestamp: '2026-09-30T11:00:00Z', note: 'Request initiated' },
      { status: 'Accepted', timestamp: '2026-09-30T12:00:00Z', note: 'Technician assigned' },
      { status: 'Scheduled', timestamp: '2026-09-30T12:00:00Z', note: 'Scheduled' },
      { status: 'On the Way', timestamp: '2026-10-01T10:30:00Z', note: 'Technician on route' },
      { status: 'In Progress', timestamp: '2026-10-01T11:15:00Z', note: 'Drum balance dampers replaced' },
      { status: 'Completed', timestamp: '2026-10-01T12:45:00Z', note: 'Service successfully completed and test cycle passed' }
    ]
  },
  {
    id: 'HF-BK-8904',
    serviceId: 'carpentry',
    serviceName: 'Carpentry - Main Door Lock jammed',
    customer: {
      name: 'Aditi Nair',
      email: 'aditi.nair@example.com',
      phone: '+91 99223 34455',
    },
    technicianId: 'TECH-103',
    technicianName: 'Vikram Saini (Demo)',
    technicianAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    problemTitle: 'Key getting stuck in brass cylinder lock',
    problemDescription: 'Main door lock does not rotate smoothly. Key has to be wiggled violently.',
    problemImages: [],
    address: {
      street: 'B-304, Sea Green Apartments',
      locality: 'Bandra West',
      city: 'Mumbai',
      postalCode: '400050',
      label: 'Home'
    },
    appointmentDate: '2026-10-04',
    appointmentTime: '04:00 PM - 06:00 PM',
    status: 'Requested',
    paymentStatus: 'Pending',
    pricing: {
      visitingCharge: 249,
      repairLabor: 0,
      materialCharge: 0,
      customerTotal: 249,
      platformFee: 25,
      technicianPayout: 224,
    },
    createdAt: '2026-10-04T00:15:00Z',
    statusHistory: [
      { status: 'Requested', timestamp: '2026-10-04T00:15:00Z', note: 'Waiting for technician acceptance' }
    ]
  }
];

export default DEMO_BOOKINGS;
