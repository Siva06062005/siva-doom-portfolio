import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CyberTerminalWorkstation from '../CyberTerminalWorkstation';

describe('CyberTerminalWorkstation', () => {
  it('renders terminal workstation and allows switching tabs', () => {
    render(<CyberTerminalWorkstation />);

    // Header and brand should be visible
    expect(screen.getAllByText(/0x_KERNEL_PANIC/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/CLEARANCE: LEVEL 5/i)).toBeInTheDocument();

    // Switch to Identity Profile Tab
    fireEvent.click(screen.getByRole('button', { name: /identity profile/i }));
    expect(screen.getByText(/OPERATIONAL IDENTITY DOSSIER/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ROOT_GHOST/i).length).toBeGreaterThan(0);

    // Switch to Tech Stack Tab
    fireEvent.click(screen.getByRole('button', { name: /tech stack/i }));
    expect(screen.getByText(/SYSTEM ARCHITECTURE & TECH MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/C \/ Low-level Kernel C/i)).toBeInTheDocument();

    // Switch to Shell Aliases Tab
    fireEvent.click(screen.getByRole('button', { name: /shell aliases/i }));
    expect(screen.getByText(/SHELL ALIAS MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/alias kpanic/i)).toBeInTheDocument();
  });

  it('executes terminal command and displays output', () => {
    render(<CyberTerminalWorkstation initialTab="terminal" />);

    const input = screen.getByPlaceholderText(/type 'help' or press tab/i);
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.submit(input.closest('form'));

    expect(screen.getAllByText(/0x_KERNEL_PANIC/i).length).toBeGreaterThan(0);
  });
});
