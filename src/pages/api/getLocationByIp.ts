import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Grab the IP, thx cloudflare:
  const ipRawData = await (await fetch('https://www.cloudflare.com/cdn-cgi/trace')).text();
  const ipAndTheRest = ipRawData.substr(ipRawData.indexOf('ip=') + 3);
  const ipAddress = ipAndTheRest.slice(0, ipAndTheRest.indexOf('\n'));
  // Grab the location, thx keycdn:
  const locationDataUrl = `https://tools.keycdn.com/geo.json?host=${ipAddress}`;
  const locationData = await (
    await fetch(locationDataUrl, { method: 'get', headers: { 'User-Agent': 'keycdn-tools:https://deardiary.ai' } })
  ).json();
  // Return the location json:
  res.status(200).json(locationData?.data?.geo || { ip: 'not found' });
};
