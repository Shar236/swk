import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 max-w-lg"
      >
        <div className="relative mb-12">
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-[12rem] font-black text-slate-100 leading-none select-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border border-slate-50 rotate-6">
              <Map className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-4">Lost in the Marketplace?</h2>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
          The page you're looking for seems to have moved or doesn't exist. Let's get you back to finding the best professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            className="h-14 px-10 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 group"
          >
            <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />
            Back to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/services')} 
            className="h-14 px-10 rounded-2xl text-lg font-bold border-slate-200"
          >
            <Search className="mr-2 h-5 w-5" />
            Browse Services
          </Button>
        </div>
        
        <button 
          onClick={() => navigate(-1)}
          className="mt-8 text-slate-400 hover:text-primary transition-colors flex items-center gap-2 mx-auto font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
