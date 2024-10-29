#!/bin/bash

# Check if the virtual environment exists
if [ -d "myenv" ]; then
    # Activate the virtual environment
    source myenv/bin/activate
else
    # Create a virtual environment
    python3 -m venv myenv
    # Activate the virtual environment
    source myenv/bin/activate
    # Install requirements
    pip install -r requirements.txt
fi

chmod +x worker.sh
chmod +x beat.sh
chmod +x MailHog.sh

python3 main.py

