/**
 * Demo Users for HomeFix Frontend Prototyping
 * NOTE: For frontend prototype demonstration and evaluation only.
 * Will later connect to Spring Boot / Spring Security JWT Authentication.
 */

export const DEMO_USERS = [
  {
    id: 'USR-CUST-01',
    name: 'Rohan Sharma',
    email: 'customer@homefix.demo',
    phone: '+91 98711 22334',
    role: 'customer', // 'customer' | 'technician' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    joinedDate: 'January 2026',
    defaultAddress: {
      street: 'Flat 402, Sunshine Heights, Sector 62',
      locality: 'Indirapuram',
      city: 'Noida',
      postalCode: '201309',
      label: 'Home'
    }
  },
  {
    id: 'USR-TECH-01',
    name: 'Rajesh Kumar (Demo)',
    email: 'technician@homefix.demo',
    phone: '+91 98765 43210',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    joinedDate: 'November 2025',
    category: 'plumbing',
    verificationStatus: 'Verified', // 'Pending' | 'Verified' | 'Rejected'
    visitingCharge: 199,
    serviceArea: 'Indirapuram, Noida'
  },
  {
    id: 'USR-ADMIN-01',
    name: 'Admin Supervisor',
    email: 'admin@homefix.demo',
    phone: '+91 99999 00000',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    joinedDate: 'October 2025',
    department: 'Platform Operations & Quality Control'
  }
];

export default DEMO_USERS;
