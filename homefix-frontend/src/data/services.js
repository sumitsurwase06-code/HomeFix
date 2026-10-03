/**
 * Demo Service Categories data for HomeFix
 * Clearly indicated as demo data for academic / demonstration purposes.
 */

export const SERVICE_CATEGORIES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    iconName: 'Wrench',
    shortDesc: 'Pipe leaks, tap replacement, drainage clogs, and water motor repairs.',
    popular: true,
    startingPrice: 199,
    estimatedTime: '45 - 90 mins',
    popularServices: [
      'Tap & Mixer Repair',
      'Toilet & Flush Tank Repair',
      'Water Tank Cleaning & Float Valve',
      'Drainage & Blockage Clearing',
      'Pipe Leakage & Joint Soldering'
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    iconName: 'Zap',
    shortDesc: 'Short circuits, switchboard repairs, ceiling fans, and wiring safety.',
    popular: true,
    startingPrice: 149,
    estimatedTime: '30 - 60 mins',
    popularServices: [
      'Switch & Socket Replacement',
      'Ceiling Fan Repair & Installation',
      'MCB & Fuse Box Diagnostics',
      'Short Circuit Troubleshooting',
      'Inverter & Battery Wiring'
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    iconName: 'Hammer',
    shortDesc: 'Door locks, hinge fixing, bespoke woodwork, and window adjustments.',
    popular: false,
    startingPrice: 249,
    estimatedTime: '60 - 120 mins',
    popularServices: [
      'Door Lock & Latch Installation',
      'Cabinet Hinge Adjustment',
      'Wooden Window Repair',
      'Custom Shelf Mounting',
      'Furniture Assembly'
    ]
  },
  {
    id: 'furniture-repair',
    name: 'Furniture Repair',
    iconName: 'Armchair',
    shortDesc: 'Sofa upholstery restoration, bed frame tightening, and polishing.',
    popular: false,
    startingPrice: 299,
    estimatedTime: '90 - 180 mins',
    popularServices: [
      'Sofa Fabric & Foam Refurbishing',
      'Wooden Table & Chair Polish',
      'Bed Frame Reinforcement',
      'Drawer Rail Replacement'
    ]
  },
  {
    id: 'leakage-repair',
    name: 'Leakage Repair',
    iconName: 'Droplets',
    shortDesc: 'Seepage detection, bathroom waterproofing, and roof dampness sealing.',
    popular: true,
    startingPrice: 399,
    estimatedTime: '60 - 150 mins',
    popularServices: [
      'Bathroom Tile Grouting & Waterproofing',
      'Ceiling Dampness Inspection',
      'Exterior Wall Crack Filling',
      'Kitchen Sink Pipe Sealing'
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    iconName: 'Paintbrush',
    shortDesc: 'Touch-ups, single room repainting, exterior coatings, and wall putty.',
    popular: false,
    startingPrice: 499,
    estimatedTime: '1 - 3 days',
    popularServices: [
      'Single Wall Accent Painting',
      'Full Room Freshening',
      'Waterproof Exterior Coating',
      'Putty & Primer Finishing'
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    iconName: 'Cpu',
    shortDesc: 'Washing machines, microwave ovens, refrigerators, and AC servicing.',
    popular: true,
    startingPrice: 249,
    estimatedTime: '45 - 90 mins',
    popularServices: [
      'AC Filter Clean & Gas Refill',
      'Washing Machine Motor & Spin Check',
      'Refrigerator Cooling Repair',
      'Microwave Magnetron Diagnostic'
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    iconName: 'Sparkles',
    shortDesc: 'Deep bathroom cleaning, kitchen degreasing, and post-repair cleanups.',
    popular: true,
    startingPrice: 349,
    estimatedTime: '90 - 180 mins',
    popularServices: [
      'Deep Bathroom Scrub & Sanitize',
      'Kitchen Chimney & Counter Degreasing',
      'Full Home Deep Sanitation',
      'Balcony & Floor Scrubbing'
    ]
  },
  {
    id: 'other-maintenance',
    name: 'Other Maintenance',
    iconName: 'Tool',
    shortDesc: 'General odd jobs, curtain rod installation, wall drilling, and hardware fix.',
    popular: false,
    startingPrice: 149,
    estimatedTime: '30 - 60 mins',
    popularServices: [
      'Drilling & TV Wall Mount',
      'Curtain Rods & Blinds Setup',
      'Mirror & Frame Hanging',
      'Doorstopper & Mesh Fixing'
    ]
  }
];

export default SERVICE_CATEGORIES;
