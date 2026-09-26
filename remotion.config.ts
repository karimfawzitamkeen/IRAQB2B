import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(15);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
// Use the pre-installed headless Chromium when present (cloud/CI environments).
if (process.env.REMOTION_CHROME) {
	Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
