import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import MagneticButton from "../components/MagneticButton";
import { sfx } from "../utils/sfx";

export default function NotFound() {
  return (
    <div className="not-found-page container">
      <motion.div
        className="not-found-card panel"
        initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="not-found-badge"
          animate={{ rotate: [0, -5, 5, -3, 0] }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ShieldAlert size={32} className="accent" />
        </motion.div>

        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ERROR 404 // UNKNOWN ROUTE
        </motion.span>

        <motion.h1
          className="glitch-text"
          data-text="TRANSMISSION DEAD END"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          TRANSMISSION DEAD END
        </motion.h1>

        <motion.p
          className="large-copy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          The terminal path requested could not be resolved. The sector may have been relocated or decommissioned.
        </motion.p>

        <motion.div
          className="not-found-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton>
            <Link to="/" className="btn btn-primary" onClick={() => sfx.playClick()}>
              <Home size={16} /> Return to Terminal
            </Link>
          </MagneticButton>
          <MagneticButton>
            <button
              onClick={() => {
                sfx.playClick();
                window.history.back();
              }}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
