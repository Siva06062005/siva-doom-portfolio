import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CyberTerminalWorkstation from '../CyberTerminalWorkstation';

describe('CyberTerminalWorkstation', () => {
  it('renders terminal workstation with Heisen_Elliot_Durden personality and allows switching tabs', () => {
    render(<CyberTerminalWorkstation />);

    // Header and brand should be visible
    expect(screen.getAllByText(/Heisen_Elliot_Durden/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/99.1% PURE/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/LEVEL 5/i)).toBeInTheDocument();

    // Switch to Identity Profile Tab
    fireEvent.click(screen.getByRole('button', { name: /identity profile/i }));
    expect(screen.getByText(/OPERATIONAL IDENTITY DOSSIER/i)).toBeInTheDocument();
    expect(screen.getByText(/BASH SHELL CONFIGURATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/HEISENBERG/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TYLER_DURDEN/i).length).toBeGreaterThan(0);

    // Switch to Tech Stack Tab
    fireEvent.click(screen.getByRole('button', { name: /tech stack/i }));
    expect(screen.getByText(/SYSTEM ARCHITECTURE & TECH MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/C \/ Low-level Kernel C/i)).toBeInTheDocument();

    // Switch to Shell Aliases Tab
    fireEvent.click(screen.getByRole('button', { name: /shell aliases/i }));
    expect(screen.getByText(/SHELL ALIAS MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/alias cook/i)).toBeInTheDocument();
    expect(screen.getByText(/alias mayhem/i)).toBeInTheDocument();
    expect(screen.getByText(/alias fsociety/i)).toBeInTheDocument();
    expect(screen.getByText(/alias blue_sky/i)).toBeInTheDocument();
  });

  it('executes cook command and displays output', () => {
    render(<CyberTerminalWorkstation initialTab="terminal" />);

    const input = screen.getByPlaceholderText(/type 'cook', 'mayhem'/i);
    fireEvent.change(input, { target: { value: 'cook' } });
    fireEvent.submit(input.closest('form'));

    expect(screen.getAllByText(/The lab is online/i).length).toBeGreaterThan(0);
  });
});
