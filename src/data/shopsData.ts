export interface Shop {
    id: string;
    name: string;
    type: 'Government' | 'Private';
    distance: string; // km
    rating: number;
    address: string;
    phone: string;
    availableSeeds: string[];
    subsidies?: string[];
    lat?: number;
    lng?: number;
    price?: string;
    stock?: string;
    delivery_available?: boolean;
    subsidy_available?: boolean;
    ai_tags?: string[];
    blockchain_verified?: boolean;
}

export const SHOP_DATA: Shop[] = [
    {
        id: '1',
        name: 'Pradhan Mantri Kisan Samridhi Kendra',
        type: 'Government',
        distance: '2.5',
        rating: 4.5,
        address: 'Near Block Office, District HQ',
        phone: '+91 1800-11-5566',
        availableSeeds: ['Wheat HD-2967', 'Paddy Basmati 1121', 'Mustard RH-749'],
        subsidies: ['50% on Wheat Seeds', 'Free Soil Testing Kit']
    },
    {
        id: '2',
        name: 'IFFCO Kisan Sewa Kendra',
        type: 'Government',
        distance: '4.2',
        rating: 4.8,
        address: 'Village Chowk, Main Road',
        phone: '+91 98765-43210',
        availableSeeds: ['Urea', 'DAP', 'Hybrid Maize', 'Vegetable Seeds'],
        subsidies: ['30% on Fertilizers']
    },
    {
        id: '3',
        name: 'AgroStar Private Limited',
        type: 'Private',
        distance: '1.8',
        rating: 4.2,
        address: 'Market Yard, Shop No. 12',
        phone: '+91 99887-77665',
        availableSeeds: ['GM Cotton', 'Exotic Vegetables', 'Imported Flower Seeds'],
    },
    {
        id: '4',
        name: 'Rajdhani Seeds & Pesticides',
        type: 'Private',
        distance: '5.0',
        rating: 4.0,
        address: 'Old Grain Market',
        phone: '+91 91234-56789',
        availableSeeds: ['Certified Potato Seeds', 'Sunflower Hybrid'],
    },
    {
        id: '5',
        name: 'Cooperative Society Store',
        type: 'Government',
        distance: '3.0',
        rating: 4.3,
        address: 'Cooperative Bank Building',
        phone: '+91 11-2345-6789',
        availableSeeds: ['Soybean JS-335', 'Chickpea JG-11'],
        subsidies: ['Credit Linkage Available']
    }
];

export const REQUIRED_DOCUMENTS = {
    Government: [
        { name: 'Aadhar Card', description: 'Identity Proof (Mandatory)' },
        { name: 'Land Record (Khatoni/7-12)', description: 'Proof of land ownership for subsidy' },
        { name: 'Bank Passbook', description: 'For DBT (Direct Benefit Transfer)' },
        { name: 'Mobile Number', description: 'Linked with Aadhar for OTP' }
    ],
    Private: [
        { name: 'Aadhar Card', description: 'Identity Proof (Optional but recommended)' },
        { name: 'Cash/UPI', description: 'Payment method' }
    ]
};

export const SEED_RECOMMENDATIONS: Record<string, any[]> = {
    "Rabi": [
        { crop: "Wheat", variety: "HD-2967", feature: "High Yield, Rust Resistant", price: "₹40/kg" },
        { crop: "Mustard", variety: "Pusa Bold", feature: "High Oil Content", price: "₹80/kg" },
        { crop: "Chickpea", variety: "JG-11", feature: "Wilt Resistant", price: "₹90/kg" }
    ],
    "Kharif": [
        { crop: "Paddy", variety: "Basmati 1509", feature: "Aromatic, Short Duration", price: "₹120/kg" },
        { crop: "Cotton", variety: "Bt Cotton", feature: "Pest Resistant", price: "₹800/pkt" },
        { crop: "Maize", variety: "Hybrid 555", feature: "Drought Tolerant", price: "₹200/kg" }
    ]
};
