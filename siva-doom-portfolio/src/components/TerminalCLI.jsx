import CyberTerminalWorkstation from "./CyberTerminalWorkstation";

/**
 * TerminalCLI — Backwards-compatible export mapping to 0x_KERNEL_PANIC Cyber Terminal Workstation
 */
export default function TerminalCLI(props) {
  return <CyberTerminalWorkstation {...props} />;
}

export { CyberTerminalWorkstation };
