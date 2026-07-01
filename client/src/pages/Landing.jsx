import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRobot, FaMicrophone, FaCode, FaChartBar, FaFileAlt } from "react-icons/fa";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      icon: <FaFileAlt className="text-4xl text-blue-400 mb-4" />,
      title: "Resume Parsing",
      desc: "Upload your PDF resume and the AI will extract your exact experience to generate hyper-personalized questions."
    },
    {
      icon: <FaMicrophone className="text-4xl text-green-400 mb-4" />,
      title: "Real-Time Voice",
      desc: "Simulate a real face-to-face video interview. The AI speaks questions aloud and listens to your verbal answers."
    },
    {
      icon: <FaCode className="text-4xl text-yellow-400 mb-4" />,
      title: "Live Code Editor",
      desc: "Tackle technical questions directly in the browser with our integrated Monaco Code Editor supporting JS, Python, Java, and C++."
    },
    {
      icon: <FaChartBar className="text-4xl text-purple-400 mb-4" />,
      title: "Deep AI Analytics",
      desc: "Receive a comprehensive scorecard evaluating your technical knowledge, confidence, and communication skills."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden relative font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaRobot className="text-4xl text-blue-500" />
          <h1 className="text-3xl font-black tracking-tight text-white">Intervu<span className="text-blue-500">.ai</span></h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-bold px-4 py-2 transition">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-full transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-semibold text-sm">
            ✨ The Future of Interview Prep
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            Master Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Technical Interview.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience hyper-realistic, AI-driven mock interviews based on your actual resume. 
            Write code, speak naturally, and get immediate, actionable feedback.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center gap-6">
            <Link to="/login" className="bg-white text-black hover:bg-gray-200 transition px-10 py-4 rounded-full font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Start Practicing Free
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-gray-800/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">We've built a comprehensive platform that simulates exactly what it feels like to interview at FAANG and Tier 1 tech companies.</p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl hover:border-gray-600 transition duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 text-center py-10 text-gray-500">
        <p className="font-semibold">&copy; {new Date().getFullYear()} Intervu.ai. All rights reserved.</p>
      </footer>

    </div>
  );
}
