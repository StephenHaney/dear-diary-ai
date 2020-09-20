import React, { useState } from 'react';
import { AboutOverlay } from './AboutOverlay';
import styled from '@emotion/styled';
import { ShareOverlay } from './ShareOverlay';

export const BottomButton = styled.button({
  border: '3px solid rgba(0, 0, 0, 0.6)',
  padding: '10px',
  paddingLeft: '30px',
  paddingRight: '30px',
  fontSize: '20px',
  background: 'none',
  color: '#555',
  borderRadius: 3,
  cursor: 'pointer',
  margin: 10,
  marginTop: 0,
  backgroundColor: '#fff',
  transition: 'transform 1s ease-out, color 1s ease-out',
  '&:hover': {
    transform: 'scale(1.04)',
    color: '#464da4',
  },
});

const Wrapper = styled.div({
  position: 'fixed',
  zIndex: 3,
  bottom: 50,
  paddingLeft: '20',
  paddingRight: '20',
  textAlign: 'right',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  '@media (min-width: 768px)': {
    bottom: 30,
    left: 60,
  },
});

const PrivacyWrapper = styled.div({
  position: 'fixed',
  zIndex: 3,
  bottom: 10,
  width: '100%',
  textAlign: 'center',
  color: '#555',
  fontWeight: 'bold',
  '@media (min-width: 768px)': {
    textAlign: 'left',
    left: 60,
    paddingLeft: '10px',
    paddingRight: '10px',
  },
});

type Props = {
  readonly: boolean;
};
export const ShareAndAbout = ({ readonly }: Props) => {
  const [aboutIsOpen, setAboutIsOpen] = useState(false);
  const [shareIsOpen, setShareIsOpen] = useState(false);

  return (
    <>
      {aboutIsOpen && <AboutOverlay setIsOpen={setAboutIsOpen} />}
      {shareIsOpen && <ShareOverlay setIsOpen={setShareIsOpen} />}

      <Wrapper>
        <BottomButton onClick={() => (window.location.href = '/?write')}>NEW</BottomButton>

        <BottomButton onClick={() => window.location.reload()}>REPLAY</BottomButton>

        <BottomButton onClick={() => setShareIsOpen(true)}>SHARE</BottomButton>

        <BottomButton onClick={() => setAboutIsOpen(true)}>about</BottomButton>
      </Wrapper>

      <PrivacyWrapper>
        Entries are public to anyone with this URL.{' '}
        <a href="/privacy" target="_blank">
          Privacy info
        </a>
      </PrivacyWrapper>
    </>
  );
};
