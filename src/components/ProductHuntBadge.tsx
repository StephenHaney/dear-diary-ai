import React from 'react';
import styled from '@emotion/styled';

const BadgeWrapper = styled.div({
  position: 'absolute',
  top: '60px',
  right: '40px',
  display: 'none',
  opacity: 0.5,
  transition: 'opacity 0.5s ease-out',

  '&:hover': {
    opacity: 1,
  },

  '@media (min-width: 1024px)': {
    display: 'block',
  },
});

export const ProductHuntBadge = () => {
  return (
    <BadgeWrapper>
      <a
        href="https://www.producthunt.com/posts/dear-diary-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dear-diary-ai"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=254440&theme=light"
          alt="Dear Diary AI - Turn your journal into music | Product Hunt Embed"
          style={{ width: '250px', height: '54px' }}
          width="250"
          height="54"
        />
      </a>
    </BadgeWrapper>
  );
};
