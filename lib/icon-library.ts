import {
  // Development & Tech
  Code, Code2, CodeSquare, Terminal, Database, Server, Cpu, HardDrive, Wifi, Globe,
  Smartphone, Monitor, Laptop, Tablet, Gamepad2, Zap, Bug, Settings, Wrench, Hammer,
  
  // Design & Creative
  Palette, Paintbrush, Pen, PenTool, Image, Camera, Video, Film, Music, Headphones,
  Mic, Speaker, Volume2, Eye, EyeOff, Layers, Square, Circle, Triangle, Star,
  
  // Business & Office
  Briefcase, Building, Building2, Factory, Store, ShoppingBag, CreditCard, DollarSign,
  TrendingUp, TrendingDown, BarChart, PieChart, Target, Award, Trophy, Medal,
  
  // Communication & Social
  Users, User, UserPlus, MessageCircle, MessageSquare, Mail, Phone, PhoneCall,
  Video as VideoCall, Mic as MicIcon, Share, Share2, Send, Bell, BellRing,
  
  // Files & Documents
  FileText, File, Files, Folder, FolderOpen, FolderPlus, Archive, Download, Upload,
  Save, Copy, Clipboard, Edit, Edit2, Edit3, Trash, Trash2, Delete,
  
  // Time & Calendar
  Calendar, CalendarDays, Clock, Timer, AlarmClock, Watch, Hourglass,
  
  // Navigation & Movement
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Move, Navigation, Compass, Map, MapPin, Route, Car, Plane, Train, Bike,
  
  // Actions & Controls
  Play, Pause, SkipForward, SkipBack, FastForward, Rewind, Repeat, Shuffle,
  Plus, Minus, X, Check, CheckCircle, CheckCircle2, XCircle, AlertCircle, Info,
  
  // Health & Fitness
  Heart, Activity, Dumbbell, Bike as BikeIcon, Apple, Coffee, Utensils,
  
  // Weather & Nature
  Sun, Moon, Cloud, CloudRain, CloudSnow, Zap as Lightning, Leaf, Trees, Flower, Mountain,
  
  // Shopping & Commerce
  ShoppingCart, Package, Package2, Truck, Gift, Tag, Tags, Percent, Receipt,
  
  // Security & Privacy
  Lock, Unlock, Key, Shield, ShieldCheck, Eye as EyeIcon, EyeOff as EyeOffIcon,
  
  // Education & Learning
  BookOpen, Book, GraduationCap, School, Library, Lightbulb, Brain, Puzzle,
  
  // Home & Living
  Home, Bed, Sofa, Lamp, Tv, Refrigerator, Microwave, WashingMachine,
  
  // Tools & Utilities
  Wrench as WrenchIcon, Hammer as HammerIcon, Scissors, Ruler, Calculator,
  
  // Sports & Games
  Trophy as TrophyIcon,
  
  // Medical & Health
  Stethoscope, Pill, Syringe, Thermometer, Bandage, Cross, Plus as PlusIcon,
  
  // Transportation
  Car as CarIcon, Bus, Rocket,
  
  // Food & Drink
  Coffee as CoffeeIcon, Wine, Beer, Pizza, Sandwich, IceCream, Cake,
  
  // Miscellaneous
  Sparkles, Flame, Droplet, Snowflake, Umbrella, Glasses, Crown, Diamond, Gem,
  Flag, Bookmark, Pin, Paperclip, Link, Anchor, Magnet, Battery, Plug
} from 'lucide-react'

export interface IconOption {
  name: string
  icon: any
  category: string
}

export const iconLibrary: IconOption[] = [
  // Development & Tech
  { name: 'Code', icon: Code, category: 'Development' },
  { name: 'Code2', icon: Code2, category: 'Development' },
  { name: 'CodeSquare', icon: CodeSquare, category: 'Development' },
  { name: 'Terminal', icon: Terminal, category: 'Development' },
  { name: 'Database', icon: Database, category: 'Development' },
  { name: 'Server', icon: Server, category: 'Development' },
  { name: 'Cpu', icon: Cpu, category: 'Development' },
  { name: 'HardDrive', icon: HardDrive, category: 'Development' },
  { name: 'Wifi', icon: Wifi, category: 'Development' },
  { name: 'Globe', icon: Globe, category: 'Development' },
  { name: 'Smartphone', icon: Smartphone, category: 'Development' },
  { name: 'Monitor', icon: Monitor, category: 'Development' },
  { name: 'Laptop', icon: Laptop, category: 'Development' },
  { name: 'Tablet', icon: Tablet, category: 'Development' },
  { name: 'Gamepad2', icon: Gamepad2, category: 'Development' },
  { name: 'Zap', icon: Zap, category: 'Development' },
  { name: 'Bug', icon: Bug, category: 'Development' },
  { name: 'Settings', icon: Settings, category: 'Development' },
  { name: 'Wrench', icon: Wrench, category: 'Development' },
  { name: 'Hammer', icon: Hammer, category: 'Development' },

  // Design & Creative
  { name: 'Palette', icon: Palette, category: 'Design' },
  { name: 'Paintbrush', icon: Paintbrush, category: 'Design' },
  { name: 'Pen', icon: Pen, category: 'Design' },
  { name: 'PenTool', icon: PenTool, category: 'Design' },
  { name: 'Image', icon: Image, category: 'Design' },
  { name: 'Camera', icon: Camera, category: 'Design' },
  { name: 'Video', icon: Video, category: 'Design' },
  { name: 'Film', icon: Film, category: 'Design' },
  { name: 'Music', icon: Music, category: 'Design' },
  { name: 'Headphones', icon: Headphones, category: 'Design' },
  { name: 'Mic', icon: Mic, category: 'Design' },
  { name: 'Speaker', icon: Speaker, category: 'Design' },
  { name: 'Volume2', icon: Volume2, category: 'Design' },
  { name: 'Eye', icon: Eye, category: 'Design' },
  { name: 'EyeOff', icon: EyeOff, category: 'Design' },
  { name: 'Layers', icon: Layers, category: 'Design' },
  { name: 'Square', icon: Square, category: 'Design' },
  { name: 'Circle', icon: Circle, category: 'Design' },
  { name: 'Triangle', icon: Triangle, category: 'Design' },
  { name: 'Star', icon: Star, category: 'Design' },

  // Business & Office
  { name: 'Briefcase', icon: Briefcase, category: 'Business' },
  { name: 'Building', icon: Building, category: 'Business' },
  { name: 'Building2', icon: Building2, category: 'Business' },
  { name: 'Factory', icon: Factory, category: 'Business' },
  { name: 'Store', icon: Store, category: 'Business' },
  { name: 'ShoppingBag', icon: ShoppingBag, category: 'Business' },
  { name: 'CreditCard', icon: CreditCard, category: 'Business' },
  { name: 'DollarSign', icon: DollarSign, category: 'Business' },
  { name: 'TrendingUp', icon: TrendingUp, category: 'Business' },
  { name: 'TrendingDown', icon: TrendingDown, category: 'Business' },
  { name: 'BarChart', icon: BarChart, category: 'Business' },
  { name: 'PieChart', icon: PieChart, category: 'Business' },
  { name: 'Target', icon: Target, category: 'Business' },
  { name: 'Award', icon: Award, category: 'Business' },
  { name: 'Trophy', icon: Trophy, category: 'Business' },
  { name: 'Medal', icon: Medal, category: 'Business' },

  // Communication & Social
  { name: 'Users', icon: Users, category: 'Communication' },
  { name: 'User', icon: User, category: 'Communication' },
  { name: 'UserPlus', icon: UserPlus, category: 'Communication' },
  { name: 'MessageCircle', icon: MessageCircle, category: 'Communication' },
  { name: 'MessageSquare', icon: MessageSquare, category: 'Communication' },
  { name: 'Mail', icon: Mail, category: 'Communication' },
  { name: 'Phone', icon: Phone, category: 'Communication' },
  { name: 'PhoneCall', icon: PhoneCall, category: 'Communication' },
  { name: 'VideoCall', icon: VideoCall, category: 'Communication' },
  { name: 'Share', icon: Share, category: 'Communication' },
  { name: 'Share2', icon: Share2, category: 'Communication' },
  { name: 'Send', icon: Send, category: 'Communication' },
  { name: 'Bell', icon: Bell, category: 'Communication' },
  { name: 'BellRing', icon: BellRing, category: 'Communication' },

  // Files & Documents
  { name: 'FileText', icon: FileText, category: 'Files' },
  { name: 'File', icon: File, category: 'Files' },
  { name: 'Files', icon: Files, category: 'Files' },
  { name: 'Folder', icon: Folder, category: 'Files' },
  { name: 'FolderOpen', icon: FolderOpen, category: 'Files' },
  { name: 'FolderPlus', icon: FolderPlus, category: 'Files' },
  { name: 'Archive', icon: Archive, category: 'Files' },
  { name: 'Download', icon: Download, category: 'Files' },
  { name: 'Upload', icon: Upload, category: 'Files' },
  { name: 'Save', icon: Save, category: 'Files' },
  { name: 'Copy', icon: Copy, category: 'Files' },
  { name: 'Clipboard', icon: Clipboard, category: 'Files' },
  { name: 'Edit', icon: Edit, category: 'Files' },
  { name: 'Edit2', icon: Edit2, category: 'Files' },
  { name: 'Edit3', icon: Edit3, category: 'Files' },
  { name: 'Trash', icon: Trash, category: 'Files' },
  { name: 'Trash2', icon: Trash2, category: 'Files' },

  // Time & Calendar
  { name: 'Calendar', icon: Calendar, category: 'Time' },
  { name: 'CalendarDays', icon: CalendarDays, category: 'Time' },
  { name: 'Clock', icon: Clock, category: 'Time' },
  { name: 'Timer', icon: Timer, category: 'Time' },

  { name: 'AlarmClock', icon: AlarmClock, category: 'Time' },
  { name: 'Watch', icon: Watch, category: 'Time' },
  { name: 'Hourglass', icon: Hourglass, category: 'Time' },

  // Actions & Controls
  { name: 'Play', icon: Play, category: 'Actions' },
  { name: 'Pause', icon: Pause, category: 'Actions' },

  { name: 'Plus', icon: Plus, category: 'Actions' },
  { name: 'Minus', icon: Minus, category: 'Actions' },
  { name: 'X', icon: X, category: 'Actions' },
  { name: 'Check', icon: Check, category: 'Actions' },
  { name: 'CheckCircle', icon: CheckCircle, category: 'Actions' },
  { name: 'CheckCircle2', icon: CheckCircle2, category: 'Actions' },
  { name: 'XCircle', icon: XCircle, category: 'Actions' },
  { name: 'AlertCircle', icon: AlertCircle, category: 'Actions' },
  { name: 'Info', icon: Info, category: 'Actions' },

  // Health & Fitness
  { name: 'Heart', icon: Heart, category: 'Health' },
  { name: 'Activity', icon: Activity, category: 'Health' },
  { name: 'Dumbbell', icon: Dumbbell, category: 'Health' },
  { name: 'Apple', icon: Apple, category: 'Health' },
  { name: 'Coffee', icon: Coffee, category: 'Health' },
  { name: 'Utensils', icon: Utensils, category: 'Health' },

  // Education & Learning
  { name: 'BookOpen', icon: BookOpen, category: 'Education' },
  { name: 'Book', icon: Book, category: 'Education' },
  { name: 'GraduationCap', icon: GraduationCap, category: 'Education' },
  { name: 'School', icon: School, category: 'Education' },
  { name: 'Library', icon: Library, category: 'Education' },
  { name: 'Lightbulb', icon: Lightbulb, category: 'Education' },
  { name: 'Brain', icon: Brain, category: 'Education' },
  { name: 'Puzzle', icon: Puzzle, category: 'Education' },

  // Home & Living
  { name: 'Home', icon: Home, category: 'Home' },
  { name: 'Bed', icon: Bed, category: 'Home' },
  { name: 'Lamp', icon: Lamp, category: 'Home' },
  { name: 'Tv', icon: Tv, category: 'Home' },

  // Miscellaneous
  { name: 'Sparkles', icon: Sparkles, category: 'Misc' },
  { name: 'Flame', icon: Flame, category: 'Misc' },
  { name: 'Droplet', icon: Droplet, category: 'Misc' },
  { name: 'Snowflake', icon: Snowflake, category: 'Misc' },
  { name: 'Umbrella', icon: Umbrella, category: 'Misc' },
  { name: 'Glasses', icon: Glasses, category: 'Misc' },
  { name: 'Crown', icon: Crown, category: 'Misc' },
  { name: 'Diamond', icon: Diamond, category: 'Misc' },
  { name: 'Gem', icon: Gem, category: 'Misc' },
  { name: 'Flag', icon: Flag, category: 'Misc' },
  { name: 'Bookmark', icon: Bookmark, category: 'Misc' },
  { name: 'Pin', icon: Pin, category: 'Misc' },
  { name: 'Paperclip', icon: Paperclip, category: 'Misc' },
  { name: 'Link', icon: Link, category: 'Misc' },
  { name: 'Anchor', icon: Anchor, category: 'Misc' },
  { name: 'Magnet', icon: Magnet, category: 'Misc' },
  { name: 'Battery', icon: Battery, category: 'Misc' },
  { name: 'Plug', icon: Plug, category: 'Misc' }
]

export const getIconByName = (iconName: string) => {
  const iconOption = iconLibrary.find(icon => icon.name === iconName)
  return iconOption?.icon || Code // Default fallback
}

export const getIconCategories = () => {
  const categories = [...new Set(iconLibrary.map(icon => icon.category))]
  return categories.sort()
}