import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import VoiceAssistant from '../VoiceAssistant';

describe('VoiceAssistant', () => {
  beforeEach(() => {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
    window.speechSynthesis = undefined;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ response: 'Hello from Veronica' }),
      })
    );
  });

  it('falls back to text chat when voice APIs are unavailable', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <VoiceAssistant />
        </MemoryRouter>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /toggle veronica ai voice assistant and chatbot/i }));

    expect(screen.getAllByText(/Veronica/i).length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText(/type a question for veronica/i), {
      target: { value: 'hello veronica' },
    });

    fireEvent.click(screen.getByLabelText(/send question to veronica/i));

    expect(screen.getByText(/hello veronica/i)).toBeInTheDocument();
  });
});
