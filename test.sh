fname=js/data.json
call="awesome_bot $fname --skip-save-results --allow-redirect --allow [L0340] -w cs1.mp3.pm"

out=$($call)
if [[ $out != *"No issues"* ]]; then
	echo $out
	echo "<<< Failed to connect, retrying.. >>>"
	out=$($call)
fi

echo $out
if [[ $out != *"No issues"* ]]; then
	exit 1 # Exit with 1 means Build Failed
else
	exit 0 # Exit with 0 means Build Passed
fi
