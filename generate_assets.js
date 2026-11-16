const fs = require('node:fs');

const width = 120;
const height = 100;
const palette = [
  [248, 241, 229], [88, 52, 31], [139, 78, 42], [188, 118, 57],
  [224, 169, 97], [255, 222, 157], [255, 250, 241], [116, 87, 62],
  ...Array(8).fill([0, 0, 0]),
];

function breadFrame(frame) {
  const pixels = new Uint8Array(width * height).fill(0);
  const put = (x, y, color) => {
    if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = color;
  };
  const ellipse = (cx, cy, rx, ry, color) => {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) put(cx + x, cy + y, color);
      }
    }
  };
  const bob = frame % 2;
  for (let x = 25; x < 97; x++) put(x, 81, 7);
  for (let x = 31; x < 92; x++) put(x, 84, 7);
  ellipse(60, 57 - bob, 36, 22, 1);
  ellipse(60, 54 - bob, 33, 21, 2);
  ellipse(60, 51 - bob, 28, 17, 3);
  ellipse(60, 48 - bob, 21, 11, 4);
  for (let x = 0; x < 3; x++) {
    const scoreX = 46 + x * 14;
    for (let y = 0; y < 9; y++) put(scoreX + y, 42 - y - bob, 5);
  }
  const steamOffset = frame % 3;
  for (let y = 0; y < 8; y++) {
    put(47 + (y + steamOffset) % 3, 20 + y, 6);
    put(65 + (y + 1 + steamOffset) % 3, 15 + y, 6);
    put(80 + (y + 2 + steamOffset) % 3, 21 + y, 6);
  }
  return pixels;
}

function lzwLiteralStream(pixels) {
  const clear = 16;
  const end = 17;
  const codes = [];
  for (const pixel of pixels) codes.push(clear, pixel);
  codes.push(end);
  const bytes = [];
  let accumulator = 0;
  let bitCount = 0;
  for (const code of codes) {
    accumulator |= code << bitCount;
    bitCount += 5;
    while (bitCount >= 8) {
      bytes.push(accumulator & 255);
      accumulator >>>= 8;
      bitCount -= 8;
    }
  }
  if (bitCount > 0) bytes.push(accumulator & 255);
  return Buffer.from(bytes);
}

function subBlocks(data) {
  const blocks = [];
  for (let offset = 0; offset < data.length; offset += 255) {
    const chunk = data.subarray(offset, Math.min(offset + 255, data.length));
    blocks.push(Buffer.from([chunk.length]), chunk);
  }
  blocks.push(Buffer.from([0]));
  return Buffer.concat(blocks);
}

function makeGif() {
  const header = Buffer.from('GIF89a', 'ascii');
  const screen = Buffer.from([width & 255, width >> 8, height & 255, height >> 8, 0xf3, 0, 0]);
  const colorTable = Buffer.from(palette.flat());
  const loopExtension = Buffer.concat([
    Buffer.from([0x21, 0xff, 0x0b]),
    Buffer.from('NETSCAPE2.0', 'ascii'),
    Buffer.from([0x03, 0x01, 0x00, 0x00, 0x00]),
  ]);
  const frames = [];
  for (let frame = 0; frame < 6; frame++) {
    frames.push(Buffer.from([0x21, 0xf9, 4, 4, 12, 0, 0, 0]));
    frames.push(Buffer.from([0x2c, 0, 0, 0, 0, width & 255, width >> 8, height & 255, height >> 8, 0]));
    frames.push(Buffer.from([4]));
    frames.push(subBlocks(lzwLiteralStream(breadFrame(frame))));
  }
  return Buffer.concat([header, screen, colorTable, loopExtension, ...frames, Buffer.from([0x3b])]);
}

function makeWav() {
  const sampleRate = 22050;
  const duration = 3.2;
  const sampleCount = Math.floor(sampleRate * duration);
  const pcm = Buffer.alloc(sampleCount * 2);
  const notes = [659.25, 783.99, 987.77, 783.99];
  const noteLength = 0.48;
  for (let index = 0; index < sampleCount; index++) {
    const time = index / sampleRate;
    const noteIndex = Math.floor(time / noteLength);
    const localTime = time % noteLength;
    const envelope = Math.exp(-localTime * 5.2) * Math.min(1, localTime * 35);
    const frequency = notes[noteIndex % notes.length];
    const chime = Math.sin(2 * Math.PI * frequency * time) + 0.28 * Math.sin(2 * Math.PI * frequency * 2.01 * time);
    const sample = Math.max(-1, Math.min(1, chime * envelope * 0.22));
    pcm.writeInt16LE(Math.round(sample * 32767), index * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

fs.writeFileSync('bread.gif', makeGif());
fs.writeFileSync('bread.wav', makeWav());
console.log('Generated original bread.gif and bread.wav.');