#!/usr/bin/env python3
"""Copy the self-contained Holo Card Preview into a new directory."""
import argparse
from pathlib import Path
import shutil

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True, help='New output directory; must not already exist')
    args = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / 'assets' / 'web'
    destination = Path(args.output).expanduser().resolve()
    if destination.exists():
        parser.error('Output already exists. Choose a new directory; nothing was overwritten.')
    if source == destination or source in destination.parents:
        parser.error('Output must be outside the bundled template.')
    shutil.copytree(source, destination)
    print(f'Created: {destination}')
    print(f'python3 -m http.server 4173 --bind 127.0.0.1 --directory "{destination}"')
    print('Desktop: http://127.0.0.1:4173/studio.html')
    print('iPhone shell: http://127.0.0.1:4173/mobile.html')

if __name__ == '__main__':
    main()
