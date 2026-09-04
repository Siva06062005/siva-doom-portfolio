import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import { sfx } from "../utils/sfx";

export default function NotFound() {
  return (
    <div className="not-found-page container">
      <motion.div
        className="not-found-card panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="not-found-badge">
          <ShieldAlert size={32} className="accent" />
        </div>
        <span className="eyebrow">ERROR 404 // UNKNOWN ROUTE</span>
        <h1>TRANSMISSION DEAD END</h1>
        <p className="large-copy">
          The terminal path requested could not be resolved. The sector may have been relocated or decommissioned.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary" onClick={() => sfx.playClick()}>
            <Home size={16} /> Return to Terminal
          </Link>
          <button
            onClick={() => {
              sfx.playClick();
              window.history.back();
            }}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
