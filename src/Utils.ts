export function toTitleCase(str: string): string {

	str = str.replace(/_/g, " ");

	let upper  = true;
	let newStr = "";
	for (let i = 0, l = str.length; i < l; i++) {
		// Note that you can also check for all kinds of spaces  with
		// str[i].match(/\s/)
		if (str[i] == " ") {
			upper = true;
			newStr += str[i];
			continue;
		}
		newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
		upper = false;
	}
	return newStr;
}
