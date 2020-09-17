import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

export const bounceIn = keyframes`
  0% {
    transform: scale(0.98);
  }

  60% {
    transform: scale(1.008);
  }

  100% {
    transform: scale(1);
  }
`;

export const Modal = styled.div({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  maxWidth: 660,
  margin: 'auto',
  top: '5vh',
  maxHeight: '90vh',
  position: 'relative',
  padding: '50px 60px',
  borderRadius: 4,
  boxShadow: '0 0 1rem 0 rgba(0, 0, 0, .08)',
  border: '1px solid #eee',
  fontSize: '21px',
  lineHeight: '32px',
  overflow: 'auto',
  animation: `${bounceIn} 1s ease`,
  boxSizing: 'border-box',

  '@media (min-width: 768px)': {
    top: '10vh',
    maxHeight: '80vh',
  },
});

export const CloseButton = styled.button({
  position: 'absolute',
  top: 20,
  right: 20,
  padding: 5,
  outline: 0,
  background: 'none',
  border: 0,
  cursor: 'pointer',
  opacity: '0.6',
  transition: 'transform 1s ease-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const EmbedContainer = styled.div(`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  > iframe, > object, > embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`);

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};
export const AboutOverlay = ({ setIsOpen }: Props) => {
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
        <h1 style={{ marginBottom: '40px' }}>Hello friend</h1>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          We created this for a ML & Music hackathon in our free time in August 2020.
        </p>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          Watch how we created DearDiary.ai:
          <EmbedContainer>
            <iframe src="https://www.youtube.com/embed/GizCAuTnv98?rel=0" frameBorder="0" allowFullScreen></iframe>
          </EmbedContainer>
        </p>

        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          <a href="https://github.com/StephenHaney/dear-diary-ai" target="_blank">
            GitHub link (open source)
          </a>
        </p>
        <h2 style={{ marginTop: '50px' }}>Authors</h2>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          Stephen Haney – follow at <a href="https://twitter.com/sdothaney">https://twitter.com/sdothaney</a>
        </p>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          Suyash Joshi – follow at <a href="https://twitter.com/suyashcjoshi">https://twitter.com/suyashcjoshi</a>
        </p>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif' }}>
          Devin Lane – follow at <a href="https://twitter.com/gentle_return">https://twitter.com/gentle_return</a>
        </p>
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
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z"
              fill="#282B2E"
            />
          </svg>
        </CloseButton>
      </Modal>
    </div>
  );
};
