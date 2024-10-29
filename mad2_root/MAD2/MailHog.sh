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

go install github.com/mailhog/MailHog@latest

cd
cd go/bin
./MailHog
