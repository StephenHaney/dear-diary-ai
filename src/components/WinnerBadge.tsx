import React from 'react';
import styled from '@emotion/styled';

const StyledBadge = styled.a({
  position: 'absolute',
  zIndex: 15,
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  textDecoration: 'none',
  fontFamily: 'arial',
  minWidth: '275px',

  '@media (min-width: 768px)': {
    transform: 'none',
    left: 'auto',
    bottom: 'auto',
    top: '60px',
    right: '40px',
  },

  '&:hover:': {
    textDecoration: 'none',
  },
});

const TopBar = styled.div({
  backgroundColor: '#F6C55F',
  color: '#70582A',
  fontSize: 22,
  padding: 4,
  paddingTop: 7,
  lineHeight: 1,
  textAlign: 'center',
  borderRadius: '3px 3px 0 0',
  fontWeight: 700,
});

const BottomBar = styled.div({
  backgroundColor: '#fff',
  color: '#999',
  fontSize: '14px',
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: 'center',
  border: '1px solid #F6C55F',
  borderRadius: '0 0 3px 3px',
  textTransform: 'uppercase',
});

export const WinnerBadge = () => {
  return (
    <StyledBadge href="https://devpost.com/software/dear-diary-ezrmgt" target="_blank">
      <TopBar>WINNER</TopBar>
      <BottomBar>magenta / gray area hackathon</BottomBar>
    </StyledBadge>
  );
};
