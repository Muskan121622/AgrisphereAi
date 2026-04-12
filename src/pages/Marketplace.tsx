
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, TrendingUp, TrendingDown, Minus, IndianRupee, Clock, Sprout, 
  Search, ChevronDown, Volume2, Phone, MapPin, User, AlertTriangle, Pause, Play, 
  Square, Lightbulb, ArrowUpRight, ArrowDownRight, Info, CheckCircle2, MessageSquare, ArrowRight,
  Star, ExternalLink, Loader2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { getProfileLocation } from "@/lib/profile-utils";
import { useToast } from "@/components/ui/use-toast";
import { NearbySuppliersMap } from "@/components/NearbySuppliersMap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNotificationStore } from "@/store/notificationStore";
import { useTranslation } from "react-i18next";
import { speakText, stopSpeech } from "@/services/voiceService";
import { useDialect } from "@/lib/use-dialect";

// Comprehensive District Mapping
const DISTRICTS: Record<string, string[]> = {
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa", "Parvathipuram Manyam", "Anakapalli", "Alluri Sitharama Raju", "Kakinada", "Konaseema", "Eluru", "NTR", "Bapatla", "Palnadu", "Nandyal", "Sri Sathya Sai", "Tirupati", "Annamayya"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding", "Kamle", "Pakke Kessang", "Lepa Rada", "Shi Yomi"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong", "Bajali", "Tamulpur"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja", "Khairagarh-Chhuikhadan-Gandai", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Sarangarh-Bilaigarh", "Shakti"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Mauganj", "Maihar", "Pandhurna"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills", "Eastern West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur", "Anupgarh", "Balotra", "Beawar", "Deeg", "Didwana-Kuchaman", "Dudu", "Gangapur City", "Jaipur Rural", "Jodhpur Rural", "Kekri", "Khairthal-Tijara", "Kotputli-Behror", "Neem Ka Thana", "Phalodi", "Salumbar", "Sanchore", "Shahpura"],
  "Sikkim": ["Gangtok", "Geyzing", "Mangan", "Namchi", "Pakyong", "Soreng"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

const Marketplace = () => {
  const { t, i18n } = useTranslation();
  const { dialect, localize } = useDialect();
  const { addNotification } = useNotificationStore();
  const [date, setDate] = useState<Date>();
  
  const { user } = useAuthStore();
  
  // Real Profile Data
  const userProfile = {
    name: user?.name || "Muskan",
    location: (localStorage.getItem(`profile_${user?.email}_district`) || "Samastipur") + ", " + (localStorage.getItem(`profile_${user?.email}_state`) || "Bihar"),
    district: localStorage.getItem(`profile_${user?.email}_district`) || "Samastipur",
    state: localStorage.getItem(`profile_${user?.email}_state`) || "Bihar",
    isVerified: true
  };

  const [crop, setCrop] = useState<string>("");
  const [acres, setAcres] = useState<string>("1");
  const [state, setState] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState("advisory");

  // Listings State
  const [listings, setListings] = useState<any[]>([]);
  const [contactVisible, setContactVisible] = useState<{ [key: string]: boolean }>({});
  const [filters, setFilters] = useState({ search: "", state: "" });
  const [newListing, setNewListing] = useState({
    farmerName: "",
    contactNumber: "",
    cropName: "",
    quantity: "",
    price: "",
    state: "",
    district: "",
    logistics_partner: true
  });

  // Negotiation State
  const [sentNegotiations, setSentNegotiations] = useState<any[]>([]);
  const [receivedNegotiations, setReceivedNegotiations] = useState<any[]>([]);
  const [isNegOpen, setIsNegOpen] = useState(false);
  const [negTarget, setNegTarget] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [negSubmitting, setNegSubmitting] = useState(false);
  const [nearbySuppliers, setNearbySuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Demands State
  const [demands, setDemands] = useState<any[]>([]);

  const fetchDemands = async () => {
    try {
      const res = await axios.get("http://localhost:5000/demands");
      setDemands(res.data);
    } catch (err) {
      console.error("Failed to fetch demands", err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/listings");
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    }
  };

  const fetchNegotiations = async () => {
    try {
      // Fetch offers sent by current user (Buyer role)
      const sentRes = await axios.get(`http://localhost:5000/negotiations?buyerName=${userProfile.name}`);
      setSentNegotiations(sentRes.data);
      
      // Fetch offers received by current user (Farmer role)
      const receivedRes = await axios.get(`http://localhost:5000/negotiations?sellerName=${userProfile.name}`);
      setReceivedNegotiations(receivedRes.data);
    } catch (err) {
      console.error("Failed to fetch negotiations", err);
    }
  };

  const handleUpdateNegotiationStatus = async (id: string, status: 'Accepted' | 'Rejected') => {
    try {
      await axios.patch("http://localhost:5000/negotiations", { id, status });
      toast({ 
        title: t('marketplace.listings.negotiations.statusUpdated'), 
        description: status === 'Accepted' ? "You have accepted the offer." : "You have rejected the offer." 
      });
      fetchNegotiations();
    } catch (err) {
      toast({ title: t('common.error'), description: "Failed to update offer status.", variant: "destructive" });
    }
  };

  const handlePostListing = async () => {
    if (!newListing.farmerName || !newListing.contactNumber || !newListing.cropName || !newListing.quantity || !newListing.price || !newListing.state || !newListing.district) {
      toast({ title: t('common.error'), description: t('marketplace.listings.fillAllFields'), variant: "destructive" });
      return;
    }

    try {
      await axios.post("http://localhost:5000/listings", newListing);
      toast({ title: t('common.success'), description: t('marketplace.listings.listingPosted') });

      addNotification({
        type: 'market',
        title: t('marketplace.listings.listingLive'),
        message: t('marketplace.listings.listingLiveMsg', { crop: newListing.cropName, price: newListing.price })
      });

      setNewListing({ farmerName: "", contactNumber: "", cropName: "", quantity: "", price: "", state: "", district: "", logistics_partner: true });
      fetchListings();
    } catch (err) {
      toast({ title: t('common.error'), description: t('marketplace.listings.listingError'), variant: "destructive" });
    }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice) return;
    setNegSubmitting(true);
    try {
      await axios.post("http://localhost:5000/negotiations", {
        listingId: negTarget.id,
        buyerId: "user_123",
        buyerName: userProfile.name,
        sellerName: negTarget.farmerName,
        offerPrice: parseFloat(offerPrice),
        originalPrice: negTarget.price,
        crop: negTarget.cropName,
        message: offerMsg,
      });
      toast({ title: "Offer Sent!", description: `Your counter-offer for ${negTarget.cropName} has been submitted.` });
      setIsNegOpen(false);
      setOfferPrice("");
      setOfferMsg("");
      fetchNegotiations();
    } catch (err) {
      toast({ title: "Error", description: "Failed to send offer.", variant: "destructive" });
    } finally {
      setNegSubmitting(false);
    }
  };

  const toggleContact = (id: string) => {
    setContactVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.cropName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesState = filters.state ? l.location.toLowerCase().includes(filters.state.toLowerCase()) : true;
    return matchesSearch && matchesState;
  }).sort((a, b) => {
    // Sort by proximity (District match first)
    const aNearby = a.district === userProfile.district;
    const bNearby = b.district === userProfile.district;
    if (aNearby && !bNearby) return -1;
    if (!aNearby && bNearby) return 1;
    return 0;
  });

  // Market Prices State
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [priceFilters, setPriceFilters] = useState({
    state: "",
    district: "",
    market: "",
    category: "All"
  });
  const [pricesLoading, setPricesLoading] = useState(false);

  const fetchMarketPrices = async () => {
    if (!priceFilters.state || !priceFilters.district) {
      toast({ title: t('marketplace.trends.detailsMissing'), description: t('marketplace.trends.enterStateDistrict'), variant: "destructive" });
      return;
    }
    setPricesLoading(true);
    try {
      // Use new endpoints that returns both Prices + AI Trends
      const res = await axios.post("http://localhost:5000/market-trends", priceFilters);

      if (res.data.prices) {
        setMarketPrices(res.data.prices);
        setMarketInsights(res.data.analysis || null);
      } else {
        // Fallback for old structure if any
        setMarketPrices(Array.isArray(res.data) ? res.data : []);
      }

      toast({ title: t('marketplace.trends.updated'), description: t('marketplace.trends.fetched') });
    } catch (err) {
      toast({ title: t('common.error'), description: t('marketplace.trends.fetchError'), variant: "destructive" });
    } finally {
      setPricesLoading(false);
    }
  };

  const fetchSuppliers = (lat: number, lng: number) => {
    setLoadingSuppliers(true);
    setLocationError(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/nearby-suppliers?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (data.length === 0) setLocationError("No stores found within 50km.");
          setNearbySuppliers(data);
        } else {
          setLocationError("Failed to fetch shops from server.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch suppliers", err);
        setLocationError("Server connection error.");
      })
      .finally(() => setLoadingSuppliers(false));
  };
  
  const handleGetLocation = () => {
    const profileLoc = getProfileLocation(user?.email);
    
    // 1. If profile info exists, fetch by address immediately so the user sees results instantly
    if (profileLoc?.fullAddress && nearbySuppliers.length === 0) {
      console.log("Fetching by profile address immediately:", profileLoc.fullAddress);
      fetchSuppliersByAddress(profileLoc.fullAddress);
    }

    // 2. Try to get precise GPS coordinates in the background
    if (!navigator.geolocation) {
      if (!profileLoc?.fullAddress) {
        setLocationError("Geolocation is not supported and no profile address found.");
      }
      return;
    }
    
    setLoadingSuppliers(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // If GPS succeeds, it will override the profile results with precise local data
        fetchSuppliers(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error("GPS Error:", err);
        // Only show error if we haven't already loaded profile results
        if (!profileLoc?.fullAddress) {
          setLoadingSuppliers(false);
          if (err.code === 1) setLocationError("Location permission denied.");
          else if (err.code === 2) setLocationError("Location unavailable.");
          else setLocationError("Location request timed out.");
        } else {
          // Profile results are already showing, so just stop the loader
          setLoadingSuppliers(false);
        }
      },
      { timeout: 8000 }
    );
  };

  const fetchSuppliersByAddress = (address: string) => {
    setLoadingSuppliers(true);
    setLocationError(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/nearby-suppliers?address=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (data.length === 0) setLocationError(`No stores found in ${address}. Try expanding search.`);
          setNearbySuppliers(data);
        } else {
          setLocationError("Failed to fetch shops from server.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch suppliers", err);
        setLocationError("Server connection error.");
      })
      .finally(() => setLoadingSuppliers(false));
  };

  // Auto-fetch suppliers on mount
  useEffect(() => {
    if (nearbySuppliers.length === 0) {
      handleGetLocation();
    }
  }, []);

  const handleAnalyze = async () => {
    if (!crop || !date || !state) {
      toast({
        title: t('marketplace.advisory.missingInfo'),
        description: t('marketplace.advisory.selectPrompt'),
        variant: "destructive",
      });
      return;
    }
    // ... existing code ...


    setLoading(true);
    try {
      // Format date as YYYY-MM-DD for backend
      const formattedDate = format(date, "yyyy-MM-dd");

      const response = await axios.post("http://localhost:5000/market-advisory", {
        crop,
        sowing_date: formattedDate,
        acres: parseFloat(acres) || 1,
        state: state
      });

      // DYNAMIC DIALECT LOCALIZATION
      const rawResult = response.data;
      if (dialect !== 'Standard') {
        toast({ title: t('common.localizing'), description: t('common.dialectTransform', { dialect }) });
        
        // Localize main fields
        for (let stage of ['stage_1', 'stage_2', 'stage_3', 'stage_4']) {
          if (rawResult[stage]) {
            // Localize summaries and descriptions
            // This is a partial list of fields to localize
            const fieldsToLocalize = ['recommended_technique', 'seed_treatment', 'fertilizer_plan', 'irrigation_schedule', 'pest_protection', 'harvest_signs', 'post_harvest_care'];
            for (let field of fieldsToLocalize) {
               if (rawResult[stage][field]) {
                 rawResult[stage][field] = await localize(rawResult[stage][field], state);
               }
            }
          }
        }
      }

      setResult(rawResult);
      
      // Auto-fetch suppliers on report generation
      handleGetLocation();

      toast({
        title: t('marketplace.advisory.analysisComplete'),
        description: t('marketplace.advisory.reportGenerated', { state }),
      });
    } catch (error) {
      console.error("Market analysis error:", error);
      toast({
        title: t('marketplace.advisory.analysisFailed'),
        description: t('marketplace.advisory.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleAudioControl = (id: string, text: string, lang: 'en-US' | 'hi-IN') => {
    if (!text) return;

    // If clicking same ID and it's speaking, toggle pause/play if supported, or just stop
    if (playingId === id) {
      if (!isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
      return;
    }

    // New audio
    setPlayingId(id);
    setIsPaused(false);
    speakText(text, lang, () => {
      setPlayingId(null);
      setIsPaused(false);
    });
  };

  const stopAudio = () => {
    stopSpeech();
    setPlayingId(null);
    setIsPaused(false);
  };

  useEffect(() => {
    fetchListings();
    fetchDemands();
    fetchNegotiations();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t('marketplace.title')}</h1>
          <p className="text-muted-foreground">
            {t('marketplace.subtitle')}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[650px] bg-primary/10">
          <TabsTrigger value="advisory" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            🌱 {t('marketplace.tabs.advisory')}
          </TabsTrigger>
          <TabsTrigger value="listings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            🛒 {t('marketplace.tabs.listings')}
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            📈 {t('marketplace.tabs.trends')}
          </TabsTrigger>
          <TabsTrigger value="demands" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            📢 {t('marketplace.tabs.demands')}
          </TabsTrigger>
        </TabsList>

        {/* TAB 4: BUYER DEMANDS */}
        <TabsContent value="demands" className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demands.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">{t('marketplace.demands.noDemands')}</p>
              </div>
            ) : (
              demands.map((demand: any) => (
                <Card key={demand.id} className="border-orange-200 overflow-hidden relative group hover:shadow-lg transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                        {t('marketplace.demands.verified')}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{demand.timestamp?.split(' ')[0]}</span>
                    </div>
                    <CardTitle className="text-xl text-slate-800">{demand.crop}</CardTitle>
                    <CardDescription>{t('common.requiredBy')} {demand.buyerName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-xs text-slate-500 block">{t('buyer.card.quantity')}</span>
                        <span className="font-bold text-slate-900">{demand.quantity} Q</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-xs text-slate-500 block">{t('marketplace.demands.targetPrice')}</span>
                        <span className="font-bold text-green-600">₹{demand.price}/Q</span>
                      </div>
                    </div>
                    {demand.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" /> {t('marketplace.demands.locationPref')}: {demand.location}
                      </div>
                    )}
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2">
                      <Phone className="w-4 h-4" /> {t('marketplace.demands.contactBtn')}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* TAB 1: SMART ADVISORY */}
        <TabsContent value="advisory" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Input Section */}
            <Card className="md:col-span-4 h-fit border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  {t('marketplace.advisory.title')}
                </CardTitle>
                <CardDescription>{t('marketplace.advisory.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('marketplace.advisory.selectCrop')}</label>
                  <Select onValueChange={setCrop} value={crop}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('marketplace.advisory.chooseCrop')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">{t('common.crops.rice')}</SelectItem>
                      <SelectItem value="wheat">{t('common.crops.wheat')}</SelectItem>
                      <SelectItem value="cotton">{t('common.crops.cotton')}</SelectItem>
                      <SelectItem value="maize">{t('common.crops.maize')}</SelectItem>
                      <SelectItem value="tomato">{t('common.crops.tomato')}</SelectItem>
                      <SelectItem value="potato">{t('common.crops.potato')}</SelectItem>
                      <SelectItem value="sugarcane">{t('common.crops.sugarcane')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('marketplace.advisory.state')}</label>
                  <Select onValueChange={setState} value={state}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('marketplace.advisory.selectState')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.keys(DISTRICTS).map((stateName) => (
                        <SelectItem key={stateName} value={stateName}>
                          {stateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('marketplace.advisory.sowingDate')}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>{t('marketplace.advisory.pickDate')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('marketplace.advisory.fieldSize')}</label>
                  <Input
                    type="number"
                    placeholder="Ex: 5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? t('marketplace.advisory.analyzing') : t('marketplace.advisory.analyzeBtn')}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section - NOW WITH ACCORDION */}
            <div className="md:col-span-8 space-y-6">
              {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <Card className="border-l-4 border-l-primary shadow-lg bg-slate-900 text-white border-slate-800">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{t('marketplace.advisory.readyTitle')} {t(`common.crops.${result.crop}`)} {t('common.in')} {result.state}</span>
                        <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">{t('common.generatedOn')} {result.generated_at}</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  {result.seasonality_check && result.seasonality_check.is_valid === false && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{t('marketplace.alerts.seasonality')}</AlertTitle>
                      <AlertDescription>
                        {result.seasonality_check.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">

                    {/* Stage 1: Seed & Sowing */}
                    <AccordionItem value="item-1" className="border rounded-lg bg-card px-4 shadow-sm border-l-4 border-l-green-500">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full">
                          <span className="text-2xl bg-green-50 p-2 rounded-full">🌱</span>
                          <div>
                            <h3 className="font-semibold text-lg">{t('marketplace.advisory.steps.s1.title')}</h3>
                            <p className="text-sm text-muted-foreground font-normal">{t('marketplace.advisory.steps.s1.subtitle')}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 border-t mt-2">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage1-en', result.stage_1?.voice_summary_en, 'en-US')}
                            className={cn("text-xs transition-colors", playingId === 'stage1-en' && "bg-green-100 border-green-300")}
                          >
                            {playingId === 'stage1-en' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            {t('marketplace.langEn')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage1-hi', result.stage_1?.voice_summary_hi, 'hi-IN')}
                            className={cn("text-xs transition-colors", playingId === 'stage1-hi' && "bg-green-100 border-green-300")}
                          >
                            {playingId === 'stage1-hi' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            {t('marketplace.langHi')}
                          </Button>
                          {(playingId === 'stage1-en' || playingId === 'stage1-hi') && (
                            <Button variant="ghost" size="sm" onClick={stopAudio} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mt-2">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <Sprout className="w-4 h-4" /> {t('marketplace.advisory.results.varieties')}
                            </h4>
                            <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                              {result.stage_1?.seed_varieties?.map((v: string, i: number) => (
                                <li key={i}>{v}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">{t('marketplace.advisory.results.technique')}</h4>
                            <p className="text-sm leading-relaxed text-gray-700">{result.stage_1?.recommended_technique}</p>
                            <div className="mt-4 text-xs bg-green-50 p-3 rounded-lg text-green-800 border border-green-200">
                              <strong>💡 {t('marketplace.advisory.results.proTip')}:</strong> {result.stage_1?.seed_treatment}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Stage 2: Growth */}
                    <AccordionItem value="item-2" className="border rounded-lg bg-card px-4 shadow-sm border-l-4 border-l-blue-500">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full">
                          <span className="text-2xl bg-blue-50 p-2 rounded-full">💧</span>
                          <div>
                            <h3 className="font-semibold text-lg">{t('marketplace.advisory.steps.s2.title')}</h3>
                            <p className="text-sm text-muted-foreground font-normal">{t('marketplace.advisory.steps.s2.subtitle')}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 border-t mt-2">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage2-en', result.stage_2?.voice_summary_en, 'en-US')}
                            className={cn("text-xs transition-colors", playingId === 'stage2-en' && "bg-blue-100 border-blue-300")}
                          >
                            {playingId === 'stage2-en' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            English
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage2-hi', result.stage_2?.voice_summary_hi, 'hi-IN')}
                            className={cn("text-xs transition-colors", playingId === 'stage2-hi' && "bg-blue-100 border-blue-300")}
                          >
                            {playingId === 'stage2-hi' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            हिंदी
                          </Button>
                          {(playingId === 'stage2-en' || playingId === 'stage2-hi') && (
                            <Button variant="ghost" size="sm" onClick={stopAudio} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mt-2">
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-2">{t('marketplace.advisory.results.fertilizer')}</h4>
                            <p className="text-sm leading-relaxed text-gray-700">{result.stage_2?.fertilizer_plan}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-2">{t('marketplace.advisory.results.irrigation')}</h4>
                            <p className="text-sm leading-relaxed text-gray-700">{result.stage_2?.irrigation_schedule}</p>
                            <div className="mt-4 text-xs bg-red-50 p-3 rounded-lg text-red-800 border-l-4 border-red-500">
                              <strong>⚠️ {t('marketplace.advisory.results.pestAlert')}:</strong> {result.stage_2?.pest_protection}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Stage 3: Harvest */}
                    <AccordionItem value="item-3" className="border rounded-lg bg-card px-4 shadow-sm border-l-4 border-l-yellow-500">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full">
                          <span className="text-2xl bg-yellow-50 p-2 rounded-full">🌾</span>
                          <div>
                            <h3 className="font-semibold text-lg">{t('marketplace.advisory.steps.s3.title')}</h3>
                            <p className="text-sm text-muted-foreground font-normal">{t('marketplace.advisory.steps.s3.subtitle')}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 border-t mt-2">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage3-en', result.stage_3?.voice_summary_en, 'en-US')}
                            className={cn("text-xs transition-colors", playingId === 'stage3-en' && "bg-yellow-100 border-yellow-300")}
                          >
                            {playingId === 'stage3-en' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            English
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage3-hi', result.stage_3?.voice_summary_hi, 'hi-IN')}
                            className={cn("text-xs transition-colors", playingId === 'stage3-hi' && "bg-yellow-100 border-yellow-300")}
                          >
                            {playingId === 'stage3-hi' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            हिंदी
                          </Button>
                          {(playingId === 'stage3-en' || playingId === 'stage3-hi') && (
                            <Button variant="ghost" size="sm" onClick={stopAudio} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mt-2">
                          <div className="bg-slate-900 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                              <Clock className="w-6 h-6 text-yellow-400" />
                              <span className="font-bold text-2xl text-yellow-50">{result.stage_3?.days_remaining} {t('marketplace.advisory.results.daysLeft')}</span>
                            </div>
                            <div className="text-sm text-slate-300">
                              <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">{t('marketplace.advisory.results.harvestWindow')}</span>
                              <span className="text-lg font-medium text-white">{result.stage_3?.harvest_window}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-700 mb-2">{t('marketplace.advisory.results.maturitySigns')}</h4>
                            <p className="text-sm leading-relaxed text-gray-700">{result.stage_3?.harvest_signs}</p>
                            <div className="mt-4 text-xs bg-yellow-50 p-3 rounded-lg text-yellow-800 border border-yellow-200">
                              <strong>🚜 {t('marketplace.advisory.results.postHarvest')}:</strong> {result.stage_3?.post_harvest_care}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Stage 4: Market */}
                    <AccordionItem value="item-4" className="border rounded-lg bg-card px-4 shadow-sm border-l-4 border-l-purple-500">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full">
                          <span className="text-2xl bg-purple-50 p-2 rounded-full">💰</span>
                          <div>
                            <h3 className="font-semibold text-lg">{t('marketplace.advisory.steps.s4.title')}</h3>
                            <p className="text-sm text-muted-foreground font-normal">{t('marketplace.advisory.steps.s4.subtitle')}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 border-t mt-2">
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage4-en', result.stage_4?.voice_summary_en, 'en-US')}
                            className={cn("text-xs transition-colors", playingId === 'stage4-en' && "bg-purple-100 border-purple-300")}
                          >
                            {playingId === 'stage4-en' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            English
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAudioControl('stage4-hi', result.stage_4?.voice_summary_hi, 'hi-IN')}
                            className={cn("text-xs transition-colors", playingId === 'stage4-hi' && "bg-purple-100 border-purple-300")}
                          >
                            {playingId === 'stage4-hi' && !isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                            हिंदी
                          </Button>
                          {(playingId === 'stage4-en' || playingId === 'stage4-hi') && (
                            <Button variant="ghost" size="sm" onClick={stopAudio} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-6 mt-4">
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-sm text-purple-600 font-medium mb-1">{t('marketplace.trends.livePrices')}</div>
                            <div className="text-2xl font-bold text-purple-900">₹{result.stage_4?.current_price}/Q</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-sm text-purple-600 font-medium mb-1">{t('farmerDashboard.tabs.yield')}</div>
                            <div className="text-2xl font-bold text-purple-900">{result.stage_4?.estimated_revenue}</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-sm text-purple-600 font-medium mb-1">{t('marketplace.trends.forecast')}</div>
                            <div className="text-2xl font-bold flex items-center justify-center gap-2">
                              {result.stage_4?.trend}
                              {result.stage_4?.trend === 'Bullish' ? <TrendingUp className="text-green-600 w-4 h-4" /> : <TrendingDown className="text-red-500 w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        <div className="h-[250px] w-full mb-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { week: 'Now', price: result.stage_4?.current_price },
                              ...(result.stage_4?.forecast || [])
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis domain={['auto', 'auto']} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                              <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#6b21a8', fontWeight: 'bold' }}
                              />
                              <Line type="monotone" dataKey="price" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: '#9333ea', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                          <div className="flex-1">
                            <div className="text-sm text-green-700 font-semibold mb-1 uppercase tracking-wide">{t('marketplace.advisory.results.recommendedMandi')}</div>
                            <div className="text-xl font-bold text-green-900 flex items-center gap-2">
                              📍 {result.stage_4?.best_mandi}
                            </div>
                            <p className="text-xs text-green-600 mt-1">{t('marketplace.advisory.results.bestValue')} {state}</p>
                          </div>
                          <Button
                            className="bg-green-700 hover:bg-green-800 whitespace-nowrap w-full md:w-auto shadow-md"
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.stage_4?.best_mandi + ' Mandi ' + state)}`, '_blank')}
                          >
                            {t('marketplace.advisory.results.sellHere')}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Stage 5: Nearby Suppliers - NEW */}
                    <AccordionItem value="item-5" className="border rounded-lg bg-card px-4 shadow-sm border-l-4 border-l-orange-500 mt-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full">
                          <span className="text-2xl bg-orange-50 p-2 rounded-full">🏪</span>
                          <div>
                            <h3 className="font-semibold text-lg">{t('marketplace.advisory.steps.suppliers.title', 'Nearby Seed & Fertilizer Stores')}</h3>
                            <p className="text-sm text-muted-foreground font-normal">{t('marketplace.advisory.steps.suppliers.subtitle', 'Verified suppliers near you')}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 border-t mt-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           {loadingSuppliers ? (
                             Array(2).fill(0).map((_, i) => (
                               <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-lg" />
                             ))
                           ) : nearbySuppliers.length > 0 ? (
                             nearbySuppliers.slice(0, 4).map((s) => (
                               <div key={s.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-orange-300 transition-colors relative group">
                                 <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={s.type === 'Government' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}>
                                      {s.type}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-yellow-600 text-sm font-bold">
                                      <Star className="h-3 w-3 fill-current" /> {s.rating}
                                    </div>
                                 </div>
                                 <h4 className="font-bold text-slate-900 group-hover:text-orange-600 truncate">{s.name}</h4>
                                 <p className="text-xs text-slate-500 flex items-start gap-1 mt-1 mb-3">
                                   <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {s.address}
                                 </p>
                                 <div className="flex gap-2">
                                   <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]" onClick={() => window.open(`tel:${s.phone}`)}>
                                     <Phone className="h-3 w-3 mr-1" /> {t('common.call', 'Call')}
                                   </Button>
                                   <Button size="sm" className="flex-1 h-8 text-[10px] bg-orange-600 hover:bg-orange-700 text-white" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + ' ' + s.address)}`, '_blank')}>
                                     <ExternalLink className="h-3 w-3 mr-1" /> {t('common.directions', 'Directions')}
                                   </Button>
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="col-span-full py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                               <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                               <p className="text-sm font-medium text-slate-600 mb-1">{locationError || "Location access required"}</p>
                               <p className="text-xs text-slate-400 mb-4 px-10">We need your location to find verified Krishi Seva Kendras and Seed stores near you.</p>
                               <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white px-6" onClick={handleGetLocation}>
                                 {loadingSuppliers ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                 Allow Location & Search
                               </Button>
                             </div>
                           )}
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="bg-primary/10 p-4 rounded-full mb-4 animate-pulse">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('marketplace.advisory.readyTitle')}</h3>
                  <p className="text-muted-foreground max-w-sm">
                    {t('marketplace.advisory.readyDesc')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: MARKETPLACE LISTINGS */}
        <TabsContent value="listings" className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar / Filters */}
            <div className="w-full md:w-1/4 space-y-4">
              {/* NEW: Logistics & Value Proposition Card */}
              <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 text-white shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-16 h-16" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {t('marketplace.whyBuy', { defaultValue: 'Why Buy on AgriSphere?' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 text-xs">
                      <div className="bg-green-500/20 p-1 rounded text-green-400">₹</div>
                      <div>
                        <span className="font-bold">Save 15-20%</span>
                        <p className="text-slate-400">By cutting out Mandi middlemen commissions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-xs">
                      <div className="bg-blue-500/20 p-1 rounded text-blue-400">📍</div>
                      <div>
                        <span className="font-bold">Zero Travel Cost</span>
                        <p className="text-slate-400">Product reaches you via local village transporters.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs">
                    <h5 className="font-bold text-indigo-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t('marketplace.localLogistics', { defaultValue: 'Local Logistics Model' })}
                    </h5>
                    <p className="text-slate-300 leading-relaxed text-[10px]">
                      We use local **Samastipur** pickup drivers already traveling this route. Lower cost than Mandi travel!
                    </p>
                  </div>

                  <Button variant="outline" className="w-full border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/20 text-[10px] h-8">
                    Learn about Delivery
                  </Button>
                </CardContent>
              </Card>

              {/* NEW: Join as Transporter Banner */}
              <Card className="bg-orange-50 border-orange-200 overflow-hidden group">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-bold text-orange-800 flex items-center gap-2">
                    <User className="w-4 h-4" /> {t('marketplace.joinTransporter', { defaultValue: 'Have a Tractor/Truck?' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-[10px] text-orange-700/80 mb-3 leading-snug">
                    Register as a **Verified AgriTransporter** and earn by delivering crops to buyers in Bihar.
                  </p>
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs h-8">
                    Join Delivery Network
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('marketplace.listings.filters')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      placeholder={t('marketplace.listings.search')}
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  <Select onValueChange={(val) => setFilters(prev => ({ ...prev, state: val === 'all' ? '' : val }))}>
                    <SelectTrigger><SelectValue placeholder={t('marketplace.advisory.selectState')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.all', { defaultValue: 'All States' })}</SelectItem>
                      <SelectItem value="bihar">{t('marketplace.states.bihar')}</SelectItem>
                      <SelectItem value="uttar pradesh">{t('marketplace.states.uttarPradesh')}</SelectItem>
                      <SelectItem value="punjab">{t('marketplace.states.punjab')}</SelectItem>
                      <SelectItem value="haryana">{t('marketplace.states.haryana')}</SelectItem>
                      <SelectItem value="madhya pradesh">{t('marketplace.states.madhyaPradesh')}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-green-400" /> {t('marketplace.listings.form.postTitle')}
                  </CardTitle>
                  <CardDescription className="text-slate-400">{t('marketplace.listings.form.postSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder={t('marketplace.listings.form.name')}
                    value={newListing.farmerName}
                    onChange={(e) => setNewListing({ ...newListing, farmerName: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Input
                    placeholder={t('marketplace.listings.form.contact')}
                    type="tel"
                    maxLength={10}
                    value={newListing.contactNumber}
                    onChange={(e) => setNewListing({ ...newListing, contactNumber: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Input
                    placeholder={t('marketplace.listings.form.crop')}
                    value={newListing.cropName}
                    onChange={(e) => setNewListing({ ...newListing, cropName: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={t('marketplace.listings.form.qty')}
                      type="number"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <Input
                      placeholder={t('marketplace.listings.form.price')}
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">{t('marketplace.advisory.state')}</label>
                      <Select value={newListing.state} onValueChange={(val) => setNewListing({ ...newListing, state: val, district: '' })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs h-9">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Object.keys(DISTRICTS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">{t('marketplace.advisory.district')}</label>
                      <Select value={newListing.district} onValueChange={(val) => setNewListing({ ...newListing, district: val })} disabled={!newListing.state}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-xs h-9">
                          <SelectValue placeholder="District" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {(newListing.state && DISTRICTS[newListing.state] ? DISTRICTS[newListing.state] : []).map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-800/50 p-2 rounded border border-slate-700">
                    <Checkbox 
                      id="logistics" 
                      checked={newListing.logistics_partner} 
                      onCheckedChange={(checked) => setNewListing({...newListing, logistics_partner: !!checked})}
                    />
                    <label htmlFor="logistics" className="text-xs text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Include AgriLogistics Partner Support
                    </label>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold mt-2 shadow-lg shadow-green-900/40" onClick={handlePostListing}>
                    📢 {t('marketplace.listings.form.submit')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Listings Grid */}
            <div className="w-full md:w-3/4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.length > 0 ? (
                  filteredListings.map((item) => {
                    const isNearby = item.district === userProfile.district;
                    return (
                      <Card key={item.id} className={cn("hover:shadow-lg transition-all duration-300 border-green-100 group", isNearby && "border-primary/50 bg-primary/5 shadow-md shadow-primary/10")}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex flex-wrap gap-1">
                              {isNearby && (
                                <Badge className="bg-primary text-white text-[10px] animate-pulse">
                                  📍 {t('marketplace.proximity.nearby', { district: userProfile.district })}
                                </Badge>
                              )}
                              <Badge variant="outline" className="bg-green-100 text-green-800 text-[10px] border-green-200">
                                ✓ {t('marketplace.demands.verified')}
                              </Badge>
                              {item.logistics_partner && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 text-[10px] border-blue-200">
                                  🚚 {t('marketplace.logistics.partner', { defaultValue: 'AgriLogistics' })}
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{item.timestamp?.split(' ')[0]}</span>
                          </div>
                          <CardTitle className="mt-1 text-lg font-extrabold text-green-800 capitalize tracking-tight">{item.cropName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3 text-primary" /> {item.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-end mb-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <div>
                              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{t('buyer.card.quantity')}</div>
                              <div className="font-bold text-white">{item.quantity} Q</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{t('buyer.card.price')}</div>
                              <div className="font-bold text-green-400 text-lg">₹{item.price}/Q</div>
                            </div>
                          </div>

                          {/* Mandi Price Comparison Badge */}
                          <div className="flex items-center justify-between px-2 py-1.5 mb-4 bg-yellow-50 rounded-md border border-yellow-100 text-[10px]">
                            <div className="text-yellow-700 font-semibold flex items-center gap-1">
                              📉 <span className="line-through">Mandi: ₹{(parseFloat(item.price) * 1.15).toFixed(0)}</span>
                            </div>
                            <div className="text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded">
                              Save ₹{(parseFloat(item.price) * 0.15).toFixed(0)}/Q here
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-xs text-slate-500 font-medium">{t('common.soldBy')}: {item.farmerName}</div>
                              {item.verified && (
                                <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                  🌟 {t('marketplace.verifiedSeller', { defaultValue: 'Verified Seller' })}
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {contactVisible[item.id] ? (
                                <div className="col-span-2 bg-green-50 border border-green-200 text-green-800 font-bold text-center py-2 rounded-md animate-in fade-in zoom-in duration-300 flex items-center justify-center gap-2">
                                  <Phone className="w-4 h-4" /> {item.contactNumber}
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 text-xs h-9"
                                  onClick={() => toggleContact(item.id)}
                                >
                                  <Phone className="w-3 h-3 mr-1" /> {t('marketplace.listings.contactFarmer')}
                                </Button>
                              )}
                              
                              {item.farmerName.toLowerCase() !== userProfile.name.toLowerCase() && (
                                <Dialog open={isNegOpen && negTarget?.id === item.id} onOpenChange={(open) => {
                                  setIsNegOpen(open);
                                  if (open) setNegTarget(item);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button className="w-full bg-slate-900 text-white hover:bg-black text-xs h-9 gap-1">
                                      🤝 {t('marketplace.negotiate', { defaultValue: 'Negotiate' })}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{t('marketplace.listings.negotiate.title', { crop: item.cropName })}</DialogTitle>
                                      <DialogDescription>
                                        {t('marketplace.listings.negotiate.desc', { seller: item.farmerName })}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">Price/Q</Label>
                                        <div className="col-span-3 flex items-center gap-4">
                                          <div className="text-slate-400 line-through">₹{item.price}</div>
                                          <Input
                                            id="price"
                                            type="number"
                                            placeholder="Your best offer"
                                            className="col-span-2"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="msg" className="text-right">Message</Label>
                                        <Input
                                          id="msg"
                                          placeholder="Add a message for the farmer"
                                          className="col-span-3"
                                          value={offerMsg}
                                          onChange={(e) => setOfferMsg(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsNegOpen(false)}>{t('common.cancel')}</Button>
                                      <Button onClick={handleMakeOffer} disabled={negSubmitting}>
                                        {negSubmitting ? t('common.sending') : t('marketplace.listings.negotiate.send')}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50/50">
                    <Sprout className="w-12 h-12 mb-2 text-slate-300" />
                    <p>{t('marketplace.listings.noListings')}</p>
                  </div>
                )}
              </div>

              {/* Active Negotiations Hub: TWO SECTIONS (Sent & Received) */}
              {(sentNegotiations.length > 0 || receivedNegotiations.length > 0) && (
                <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* SECTION 1: Sent Offers (Buyer Role) */}
                  {sentNegotiations.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-xl font-bold text-slate-200">{t('marketplace.listings.negotiations.myOffers')}</h3>
                        <Badge variant="secondary" className="ml-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{sentNegotiations.length}</Badge>
                      </div>
                      
                      <div className="grid gap-3">
                        {sentNegotiations.map((neg) => (
                          <Card key={neg.id} className="border-l-4 border-l-indigo-500 bg-slate-900 border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
                            <CardContent className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                  <Sprout className="w-6 h-6" />
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-2 text-lg">
                                    {neg.crop} 
                                    <ArrowRight className="w-4 h-4 text-slate-500" /> 
                                    <span className="text-indigo-400">₹{neg.offerPrice}/Q</span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-0.5">{t('common.originalPrice', { defaultValue: 'Original' })}: ₹{neg.originalPrice}/Q</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">{t('common.status', { defaultValue: 'Status' })}</div>
                                  <Badge 
                                    className={cn(
                                      "font-bold py-1 px-3",
                                      neg.status === 'Pending' ? "bg-yellow-900/50 text-yellow-500 border-yellow-700/50" :
                                      neg.status === 'Accepted' ? "bg-green-900/50 text-green-500 border-green-700/50" :
                                      "bg-red-900/50 text-red-500 border-red-700/50"
                                    )}
                                  >
                                    {neg.status === 'Pending' && <Clock className="w-3 h-3 mr-1 inline" />}
                                    {neg.status === 'Accepted' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                                    {neg.status === 'Rejected' && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                                    {neg.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                  {t('common.viewDetails', { defaultValue: 'View' })}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: Received Offers (Farmer/Seller Role) */}
                  {receivedNegotiations.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-orange-900/50 pb-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <h3 className="text-xl font-bold text-slate-200">{t('marketplace.listings.negotiations.receivedOffers')}</h3>
                        <Badge variant="secondary" className="ml-2 bg-orange-500/20 text-orange-400 border border-orange-500/30">{receivedNegotiations.length}</Badge>
                      </div>
                      
                      <div className="grid gap-3">
                        {receivedNegotiations.map((neg) => (
                          <Card key={neg.id} className="border-l-4 border-l-orange-500 bg-slate-900 border-slate-800 shadow-sm hover:border-orange-500/50 transition-all">
                            <CardContent className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                                  <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-white text-lg">
                                    {neg.buyerName} <span className="font-normal text-slate-400 text-sm">{t('common.wantsToBuy', { defaultValue: 'wants to buy' })}</span> <span className="text-orange-400">{neg.crop}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm mt-1">
                                    <span className="text-slate-500 line-through">₹{neg.originalPrice}/Q</span>
                                    <span className="text-green-400 font-extrabold text-xl">₹{neg.offerPrice}/Q</span>
                                    <Badge variant="outline" className="text-[10px] bg-green-900/20 text-green-400 border-green-800 ml-2">
                                      Save ₹{neg.originalPrice - neg.offerPrice}/Q
                                    </Badge>
                                  </div>
                                  {neg.message && (
                                    <p className="text-sm text-slate-300 mt-3 italic bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                      "{neg.message}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {neg.status === 'Pending' ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-900/20"
                                      onClick={() => handleUpdateNegotiationStatus(neg.id, 'Accepted')}
                                    >
                                      <CheckCircle2 className="w-4 h-4" /> {t('marketplace.listings.negotiations.accept')}
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-900/50 text-red-500 hover:bg-red-950/50 hover:text-red-400 gap-2"
                                      onClick={() => handleUpdateNegotiationStatus(neg.id, 'Rejected')}
                                    >
                                      <AlertTriangle className="w-4 h-4" /> {t('marketplace.listings.negotiations.reject')}
                                    </Button>
                                  </>
                                ) : (
                                  <Badge 
                                    className={cn(
                                      "font-bold py-1.5 px-4",
                                      neg.status === 'Accepted' && "bg-green-900/50 text-green-500 border-green-700/50",
                                      neg.status === 'Rejected' && "bg-red-900/50 text-red-500 border-red-700/50"
                                    )}
                                  >
                                    {neg.status === 'Accepted' ? 'APPROVED' : 'DECLINED'}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: REAL-TIME MARKET PRICES */}
        <TabsContent value="trends" className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="w-full md:w-1/4 space-y-4">
              <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{t('marketplace.trends.selectState')}</CardTitle>
                  <CardDescription className="text-slate-400">{t('marketplace.trends.findMandiRates', "Find today's mandi rates")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{t('marketplace.advisory.state')}</label>
                    <Select
                      value={priceFilters.state}
                      onValueChange={(val) => setPriceFilters({ ...priceFilters, state: val, district: '' })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder={t('marketplace.advisory.selectState')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {[
                          "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
                          "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
                          "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
                          "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
                          "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                        ].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{t('marketplace.advisory.district')}</label>
                    <Select
                      value={priceFilters.district}
                      onValueChange={(val) => setPriceFilters({ ...priceFilters, district: val })}
                      disabled={!priceFilters.state}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder={t('marketplace.advisory.selectDistrict')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {(priceFilters.state && DISTRICTS[priceFilters.state] ? DISTRICTS[priceFilters.state] : []).map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                        <SelectItem value="Other">{t('common.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {priceFilters.district === 'Other' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-sm font-medium text-slate-300">{t('marketplace.trends.enterDistrict')}</label>
                      <Input
                        placeholder={t('marketplace.trends.typeDistrict')}
                        className="bg-slate-800 border-slate-700 text-white"
                        onChange={(e) => setPriceFilters({ ...priceFilters, district: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{t('marketplace.trends.category')}</label>
                    <Select onValueChange={(val) => setPriceFilters({ ...priceFilters, category: val })} defaultValue="All">
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder={t('marketplace.trends.category')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="All">{t('marketplace.trends.allCommodities')}</SelectItem>
                        <SelectItem value="Vegetables">{t('marketplace.trends.vegetables')}</SelectItem>
                        <SelectItem value="Fruits">{t('marketplace.trends.fruits')}</SelectItem>
                        <SelectItem value="Cereals">{t('marketplace.trends.cereals')}</SelectItem>
                        <SelectItem value="Pulses">{t('marketplace.trends.pulses')}</SelectItem>
                        <SelectItem value="Oilseeds">{t('marketplace.trends.oilseeds')}</SelectItem>
                        <SelectItem value="Spices">{t('marketplace.trends.spices')}</SelectItem>
                        <SelectItem value="Fibres">{t('marketplace.trends.fibres')}</SelectItem>
                        <SelectItem value="Flowers">{t('marketplace.trends.flowers')}</SelectItem>
                        <SelectItem value="Dry Fruits">{t('marketplace.trends.dryFruits')}</SelectItem>
                        <SelectItem value="Beverages">{t('marketplace.trends.beverages')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20" onClick={fetchMarketPrices} disabled={pricesLoading}>
                    {pricesLoading ? t('common.loading') : t('marketplace.trends.checkRates') || "Check Live Rates"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Area */}
            <div className="w-full md:w-3/4 space-y-6">

              {/* NEW: AI Market Intelligence Dashboard */}
              {marketInsights && (
                <Card className="bg-slate-900 border-indigo-500/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <TrendingUp className="w-64 h-64 text-indigo-500" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50 px-3 py-1">
                        <Lightbulb className="w-3 h-3 mr-2 text-yellow-400" /> {t('marketplace.trends.title')}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-white font-bold tracking-tight">{t('marketplace.trends.strategicAdvisory')}</CardTitle>
                    <div className="flex flex-col gap-2 mt-1">
                      <CardDescription className="text-slate-400 text-base">{marketInsights.market_summary}</CardDescription>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className={cn("h-8 text-xs font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30", playingId === 'market-en' && "bg-indigo-500 text-white animate-pulse")}
                          onClick={() => handleAudioControl('market-en', marketInsights.voice_script_en || marketInsights.market_summary || "Summary unavailable", 'en-US')}
                        >
                          {playingId === 'market-en' && !isPaused ? <Pause className="w-3 h-3 mr-2" /> : <Volume2 className="w-3 h-3 mr-2" />}
                          {t('common.playEnglish')}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className={cn("h-8 text-xs font-semibold bg-orange-500/10 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30", playingId === 'market-hi' && "bg-orange-500 text-white animate-pulse")}
                          onClick={() => handleAudioControl('market-hi', marketInsights.voice_script_hi || "Hindi translation unavailable in AI response. Please try again.", 'hi-IN')}
                        >
                          {playingId === 'market-hi' && !isPaused ? <Pause className="w-3 h-3 mr-2" /> : <Volume2 className="w-3 h-3 mr-2" />}
                          {t('common.playHindi')}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-8 mt-4">
                      {/* Left: Strategic Advice */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-indigo-300 flex items-center gap-2 uppercase tracking-wider text-xs">
                          <Info className="w-4 h-4" /> {t('marketplace.trends.recommendations')}
                        </h4>
                        <ul className="space-y-3">
                          {marketInsights.advice?.map((tip: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-sm text-slate-200 bg-slate-950/80 p-4 rounded-lg border border-slate-800 shadow-sm hover:border-indigo-500/50 transition-colors">
                              {tip.toLowerCase().includes("sell") ? (
                                <ArrowUpRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <ArrowDownRight className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              )}
                              <span className="leading-relaxed">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Trend Graph */}
                      <div className="h-[250px] w-full bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                        <h4 className="font-semibold text-indigo-300 mb-6 flex items-center gap-2 uppercase tracking-wider text-xs">
                          <TrendingUp className="w-4 h-4" /> {t('marketplace.trends.forecastTitle')}
                        </h4>
                        <ResponsiveContainer width="100%" height="85%">
                          <LineChart data={
                            [0, 1, 2, 3, 4, 5, 6].map(i => {
                              const point: any = { day: `Day ${i + 1}` };
                              marketInsights.trends?.forEach((t: any) => {
                                point[t.commodity] = t.forecast_7_days?.[i] || 0;
                              });
                              return point;
                            })
                          }>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                              itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            {marketInsights.trends?.map((t: any, idx: number) => (
                              <Line
                                key={idx}
                                type="monotone"
                                dataKey={t.commodity}
                                stroke={['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][idx % 4]}
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 0, fill: ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][idx % 4] }}
                                activeDot={{ r: 6 }}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="h-full border-none shadow-none bg-transparent">
                <CardHeader className="pl-0 pt-0">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="text-green-600" /> {t('marketplace.trends.livePrices')}
                    {marketPrices.length > 0 && (
                      <Badge variant="outline" className={cn("ml-2 font-normal",
                        marketPrices[0]?.source?.includes("Agmarknet")
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      )}>
                        {t('marketplace.trends.source')}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{t('marketplace.trends.subtitle', { district: priceFilters.district || 'Selected District', state: priceFilters.state || 'India' })}</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  {pricesLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : marketPrices.length > 0 ? (
                    <div className="grid gap-3">
                      {marketPrices.map((price, idx) => (
                        <div key={idx} className="bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-center hover:bg-slate-800/80 transition-all group">
                          <div className="flex-1">
                            <div className="flex flex-col gap-1 mb-2">
                              {price.market && <span className="text-xs font-semibold text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded w-fit border border-blue-900/50">{price.market}</span>}
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{price.commodity}</h3>
                                <span className="text-xs bg-green-900/30 text-green-400 border border-green-800/50 px-2 py-1 rounded">{price.variety}</span>
                                {price.grade && <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded">{price.grade}</span>}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">{t('marketplace.trends.updated')}: {price.date}</p>
                          </div>

                          <div className="flex gap-6 mt-2 md:mt-0">
                            <div className="text-center">
                              <div className="text-xs text-slate-400 uppercase">{t('marketplace.trends.minPrice')}</div>
                              <div className="font-semibold text-slate-200">₹{price.min_price}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-400 uppercase">{t('marketplace.trends.maxPrice')}</div>
                              <div className="font-semibold text-slate-200">₹{price.max_price}</div>
                            </div>
                            <div className="text-center bg-green-950/30 px-5 py-2 rounded border border-green-900">
                              <div className="text-[10px] text-green-500 uppercase font-bold tracking-wider">{t('marketplace.trends.modalPrice')}</div>
                              <div className="font-bold text-green-400 text-xl">₹{price.modal_price}/{t('seeds.qtyUnit', { defaultValue: 'kg' })}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50/50">
                      <Search className="w-12 h-12 mb-2 text-slate-300" />
                      <p>{t('marketplace.trends.noRates')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Marketplace;