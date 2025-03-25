function extractBody(code) {
    let body = {};
    
    // Regular expression to match key-value pairs, including triple-quoted and multi-line values
    let regex = /"([^"]+)"\s*:\s*(?:"""([\s\S]+?)"""|"([^"]*)"|(\d+|true|false|null))/gm;
    
    let match;
    while ((match = regex.exec(code)) !== null) {
        let key = match[1]; // Extract key
        let value = match[2] || match[3] || match[4]; // Extract the correct value
        
        // Convert numeric and boolean values properly
        if (!isNaN(value) && value !== null) {
            value = Number(value);
        } else if (value === "true") {
            value = true;
        } else if (value === "false") {
            value = false;
        } else if (value === "null") {
            value = null;
        }

        // Remove escape sequences for multi-line private keys or JWT tokens
        if (typeof value === "string") {
            value = value.replace(/\\n/g, "\n").replace(/\\/g, ""); // Convert JSON-style `\n` to actual newlines
        }

        body[key] = value;
    }

    return body;
}

export default extractBody;