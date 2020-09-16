import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import '../firebase/initFirebase';
import { generateEntry } from '../firebase/createEntry';
import { useRouter } from 'next/router';
import * as Tone from 'tone';
import styled from '@emotion/styled';
import { WinnerBadge } from '../components/WinnerBadge';

const StartButton = styled.button({
  marginTop: '30px',
  outline: 'none',
  background: 'white',
  padding: '15px',
  paddingLeft: '40px',
  paddingRight: '40px',
  fontSize: '20px',
  borderRadius: '50px',
  opacity: '0.8',
  cursor: 'pointer',
  transition: 'transform 1s ease-out',
  '&:hover': { transform: 'scale(1.07)' },
  '&:active': { transform: 'scale(1.03)' },
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Dear Diary AI - privacy info</title>
      </Head>
      <div style={{ padding: '20px', maxWidth: '660px', margin: 'auto' }}>
        <h1 style={{ marginBottom: '40px' }}>Entries are public</h1>
        <p style={{ fontFamily: 'San Francisco, Arial, sans serif', fontSize: 21, lineHeight: '30px' }}>
          This is a hackathon project created with love and for fun. We don't plan to do anything with user data. We
          hope you enjoy the app!
        </p>

        <p style={{ fontFamily: 'San Francisco, Arial, sans serif', fontSize: 21, lineHeight: '30px' }}>
          <span style={{ fontWeight: 'bold' }}>Please note that entries are public by default</span>.
        </p>

        <p style={{ fontFamily: 'San Francisco, Arial, sans serif', fontSize: 21, lineHeight: '30px' }}>
          Anyone with the URL to your entry can play it back.
        </p>

        <p style={{ fontFamily: 'San Francisco, Arial, sans serif', fontSize: 21, lineHeight: '30px' }}>
          We make no claim to ownership of user content. If you'd like an entry removed, just reach out on twitter{' '}
          <a href="https://twitter.com/sdothaney">@sdothaney</a>.
        </p>

        <p style={{ fontFamily: 'San Francisco, Arial, sans serif', fontSize: 21, lineHeight: '30px' }}>
          <a href="/">{`<--`} Back</a>
        </p>
      </div>
    </>
  );
}
