import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CyberTerminalWorkstation from '../CyberTerminalWorkstation';

describe('CyberTerminalWorkstation', () => {
  it('renders guest workstation with 0x_KERNEL_PANIC and allows switching tabs', () => {
    render(<CyberTerminalWorkstation />);

    // Header and brand should be visible
    expect(screen.getAllByText(/0x_KERNEL_PANIC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GUEST EXPLORER/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/LEVEL 1 ACCESS/i)).toBeInTheDocument();

    // Switch to Identity Profile Tab
    fireEvent.click(screen.getByRole('button', { name: /identity profile/i }));
    expect(screen.getByText(/OPERATIONAL ARCHITECT DOSSIER/i)).toBeInTheDocument();
    expect(screen.getByText(/PRODUCTION DEVOPS BASH CONFIGURATION/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Terraform & IaC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kubernetes & Docker/i).length).toBeGreaterThan(0);

    // Switch to Tech Stack Tab
    fireEvent.click(screen.getByRole('button', { name: /tech stack/i }));
    expect(screen.getByText(/SYSTEM ARCHITECTURE & TECH MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/C \/ Low-level Kernel C/i)).toBeInTheDocument();

    // Switch to Shell Aliases Tab
    fireEvent.click(screen.getByRole('button', { name: /shell aliases/i }));
    expect(screen.getByText(/SHELL ALIAS MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText(/alias dockclean/i)).toBeInTheDocument();
    expect(screen.getByText(/alias k8spods/i)).toBeInTheDocument();
    expect(screen.getByText(/alias tfapply/i)).toBeInTheDocument();
  });

  it('executes help and about commands and displays output for visitors', () => {
    render(<CyberTerminalWorkstation initialTab="terminal" />);

    const input = screen.getByPlaceholderText(/type 'help', 'neofetch'/i);

    // Run 'about'
    fireEvent.change(input, { target: { value: 'about' } });
    fireEvent.submit(input.closest('form'));
    expect(screen.getAllByText(/SIVA S — DEVOPS & CLOUD ARCHITECT/i).length).toBeGreaterThan(0);

    // Run 'help'
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form'));
    expect(screen.getAllByText(/AVAILABLE SYSTEM COMMANDS/i).length).toBeGreaterThan(0);
  });
});
