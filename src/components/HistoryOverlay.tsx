import React from 'react';
import { BottomButton } from './ShareAndAbout';
import { CloseButton, Modal } from './AboutOverlay';
import { getLocalEntries } from '../firebase/createEntry';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};
export const HistoryOverlay = ({ setIsOpen }: Props) => {
  const entries = getLocalEntries().reverse();
  const listItems = entries.map((entry) =>
    <li><a href={entry.id}>{entry.id}</a> (Created: {(new Date(entry.entry.created)).toLocaleDateString() + " " + (new Date(entry.entry.created)).toLocaleTimeString()})</li>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        zIndex: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
      }}
      onClick={(e) => {
        // If the click is on the overlay, close the modal
        if (e.currentTarget === e.target) {
          setIsOpen(false);
        }
      }}
    >
      <Modal>
        <h1 style={{ marginBottom: '40px' }}>Your songs</h1>

        <ul>{listItems}</ul>
        <CloseButton onClick={() => setIsOpen(false)}>
          <svg
            style={{ transform: 'scale(2)' }}
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z"
              fill="#282B2E"
            />
          </svg>
        </CloseButton>
      </Modal>
    </div>
  );
};
