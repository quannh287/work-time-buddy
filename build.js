#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildScript {
    constructor() {
        this.rootDir = __dirname;
        this.distDir = path.join(this.rootDir, 'dist');
        this.sourceFiles = [
            'manifest.json',
            'popup.html',
            // CSS moved into styles/
            'popup.js',
            'background.js',
            'options.html',
            // CSS moved into styles/
            'options.js',
            'styles/',
            'lib/',
            'icons/',
            '_locales/'
        ];
    }

    async build() {
        console.log('🚀 Building WorkTime Buddy Chrome Extension...\n');

        try {
            // Clean/create dist directory
            this.cleanDistDirectory();

            // Copy source files
            this.copySourceFiles();

            // Bundle & minify JS entry points into dist
            await this.bundleAndMinify();

            // Minify CSS assets into dist
            await this.minifyCss();

            // Create zip archive
            await this.createZipArchive();

            console.log('\n✅ Build completed successfully!');
            console.log(`📦 Extension package: ${path.join(this.distDir, 'worktime-buddy.zip')}`);
            console.log('\n📝 Next steps:');
            console.log('1. Load the extension in Chrome (chrome://extensions/)');
            console.log('2. Enable Developer mode');
            console.log('3. Click "Load unpacked" and select the dist/ folder');
            console.log('4. Or upload worktime-buddy.zip to Chrome Web Store');

        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    }

    async bundleAndMinify() {
        console.log('🧩 Bundling & minifying JavaScript with esbuild...');

        let esbuild;
        try {
            esbuild = require('esbuild');
        } catch (error) {
            console.log('📦 Installing esbuild dependency...');
            try {
                execSync('npm install --save-dev esbuild', { stdio: 'inherit' });
                esbuild = require('esbuild');
            } catch (installErr) {
                console.error('❌ Failed to install esbuild:', installErr.message);
                throw installErr;
            }
        }

        const entryPoints = [
            path.join(this.rootDir, 'background.js'),
            path.join(this.rootDir, 'popup.js'),
            path.join(this.rootDir, 'options.js'),
        ];

        try {
            await esbuild.build({
                entryPoints,
                outdir: this.distDir,
                bundle: true,
                minify: true,
                sourcemap: false,
                splitting: false,      // single file per entry (MV3-friendly)
                format: 'iife',        // self-contained for browser contexts
                platform: 'browser',
                target: ['es2020'],    // or specific Chrome versions
                logLevel: 'info'
            });
            console.log('✅ Bundled & minified JS files.');
        } catch (error) {
            console.error('❌ esbuild failed:', error.message);
            throw error;
        }
    }

    async minifyCss() {
        console.log('🎨 Minifying CSS with esbuild...');

        let esbuild;
        try {
            esbuild = require('esbuild');
        } catch (error) {
            console.log('📦 Installing esbuild dependency for CSS...');
            try {
                execSync('npm install --save-dev esbuild', { stdio: 'inherit' });
                esbuild = require('esbuild');
            } catch (installErr) {
                console.error('❌ Failed to install esbuild for CSS:', installErr.message);
                throw installErr;
            }
        }

        const cssEntries = [
            path.join(this.rootDir, 'styles', 'popup.css'),
            path.join(this.rootDir, 'styles', 'options.css'),
            path.join(this.rootDir, 'styles', 'md3.css')
        ].filter(p => fs.existsSync(p));

        if (cssEntries.length === 0) {
            console.log('ℹ️ No CSS files found to minify.');
            return;
        }

        try {
            await esbuild.build({
                entryPoints: cssEntries,
                outdir: path.join(this.distDir, 'styles'),
                outbase: path.join(this.rootDir, 'styles'),
                bundle: false,
                minify: true,
                sourcemap: false,
                logLevel: 'info'
            });
            console.log('✅ CSS minified.');
        } catch (error) {
            console.error('❌ CSS minification failed:', error.message);
            throw error;
        }
    }

    cleanDistDirectory() {
        console.log('🧹 Cleaning dist directory...');

        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }

        fs.mkdirSync(this.distDir, { recursive: true });
        console.log('✅ Dist directory cleaned');
    }

    copySourceFiles() {
        console.log('📁 Copying source files...');

        this.sourceFiles.forEach(file => {
            const sourcePath = path.join(this.rootDir, file);
            const destPath = path.join(this.distDir, file);

            if (!fs.existsSync(sourcePath)) {
                console.warn(`⚠️  Warning: ${file} not found, skipping...`);
                return;
            }

            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
                console.log(`📂 Copied directory: ${file}`);
            } else {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`📄 Copied file: ${file}`);
            }
        });

        console.log('✅ Source files copied');
    }

    copyDirectory(source, destination) {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        const files = fs.readdirSync(source);

        files.forEach(file => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }

    async createZipArchive() {
        console.log('📦 Creating zip archive...');

        try {
            // Check if archiver is available
            let archiver;
            try {
                archiver = require('archiver');
            } catch (error) {
                console.log('📦 Installing archiver dependency...');
                execSync('npm install archiver', { stdio: 'inherit' });
                archiver = require('archiver');
            }

            const output = fs.createWriteStream(path.join(this.distDir, 'worktime-buddy.zip'));
            const archive = archiver('zip', { zlib: { level: 9 } });

            return new Promise((resolve, reject) => {
                output.on('close', () => {
                    console.log(`✅ Zip archive created: ${archive.pointer()} bytes`);
                    resolve();
                });

                archive.on('error', (err) => {
                    reject(err);
                });

                archive.pipe(output);

                // Add all files from dist directory to zip
                archive.directory(this.distDir, false);

                archive.finalize();
            });

        } catch (error) {
            console.error('❌ Failed to create zip archive:', error.message);
            console.log('💡 Tip: Install archiver with: npm install archiver');
            throw error;
        }
    }
}

// Run build if this script is executed directly
if (require.main === module) {
    const builder = new BuildScript();
    builder.build().catch(error => {
        console.error('Build failed:', error);
        process.exit(1);
    });
}

module.exports = BuildScript;
