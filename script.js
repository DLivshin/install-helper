                                                        
const app = document.getElementById('app');
if (!app) {
    console.error('Could not find the #app element.');
}
app.innerHTML = '';
const shadowRoot = app.attachShadow({ mode: 'open' });

const isDebugMode = false; // Set to false to disable console logs

// ========================================================================
// HTML Template & Styling
// ========================================================================

const template = `
    <style>
        /* --- Component Styling --- */
        :host { display: block; font-family: 'Arial', 'Helvetica', sans-serif; font-size: 16px; color: #333; --primary-color: #40be46; --primary-dark-color: #45a049; --border-color: #ddd; --text-light: #555; --section-bg: #fdfdfd; --table-header-bg: #f0f0f0; --highlight-bg: #e8f5e9; --details-bg: #f1f1f1; --code-bg: #f5f5f5; --aside-bg: #f8f8f8; --aside-border: #eee;}
        p, ul, li, label, details { line-height: 1.6; color: var(--text-light); }
        ul { padding-left: 20px; margin-bottom: 1em; }
        ol { padding-left: 25px; margin-bottom: 1em; }
        li { margin-bottom: 0.5em; }
        a { color: var(--primary-dark-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: none; border-top: 1px solid var(--border-color); margin: 1em 0; }
        code { background-color: var(--code-bg); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; color: #c7254e; font-size: 0.95em; }
        pre { position: relative; background-color: var(--code-bg); border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; padding-right: 45px; /* Space for button */ overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; font-size: 0.9em; margin-top: 0.5em; margin-bottom: 1em; }
        pre code { background-color: transparent; padding: 0; color: inherit; white-space: pre-wrap; }
        .copy-button { position: absolute; top: 5px; right: 5px; background-color: #6c757d; color: white; border: none; border-radius: 3px; padding: 3px 8px; font-size: 0.8em; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
        pre:hover .copy-button { opacity: 1; }
        .copy-button:hover { background-color: #5a6268; }
        .copy-button:active { background-color: #545b62; }

        h1, h2, h3 { color: var(--primary-color); margin-top: 1.5em; margin-bottom: 0.5em; font-weight: normal; }
        h1 { font-size: 2.2em; font-weight: bold; text-shadow: 1px 1px 2px #eee; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.3em; margin-top: 0; }
        h3 { font-size: 1.4em; color: var(--primary-dark-color); margin-top: 1.5em; }
        h4 { font-size: 1.2em; color: #444; margin-bottom: 0.3em; margin-top: 1.2em; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 0.2em;}
        h5 { font-size: 1em; color: #555; margin-bottom: 0.2em; font-weight: bold; }


        label { display: block; font-weight: bold; color: #333; margin-bottom: 0.5em; font-size: 1em; }
            /* Specific label styles */
        .input-group label { margin-bottom: 0.2em; font-size: 0.9em; font-weight: normal; color: var(--text-light); }
        label.inline-label { display: inline-block; margin-left: 0.5em; font-weight: normal; } /* For checkboxes */

        select, input[type="text"], input[type="password"], input[type="number"] { /* Added number */
            display: block; width: 100%; max-width: 450px; padding: 10px 12px; font-size: 1em; border: 1px solid var(--border-color); border-radius: 4px; background-color: white; color: #333; box-sizing: border-box; transition: border-color 0.2s ease, box-shadow 0.2s ease; margin-bottom: 1em;
        }
            input[type="checkbox"] { margin-right: 0.5em; vertical-align: middle; }
            input[type="radio"] { margin-right: 0.3em; vertical-align: middle; }
        .radio-group label { display: inline-block; margin-right: 1em; font-weight: normal; }

        .s3info {
            max-height: 0;
            overflow: hidden; 
            transition: 1.25s ease-out; 
            color: #8a6d3b; background-color: #fcf8e3;  padding: 0px 0px; border-radius: 4px; margin-top: 10px;
        }
        .s3info.visible{
            max-height: 10vh;
            transition: 1.25s ease-in; 
            color: #8a6d3b; background-color: #fcf8e3;  padding: 10px 15px; border-radius: 4px; margin-top: 10px; 
        }
        
        .transition{
            max-height: 0;
            overflow: hidden; 
            transition: 1.25s ease-out; 
        }
        .transition.visible{
            max-height: 10vh;
            transition: 1.25s ease-in; 
        }
            
        select:focus, input[type="text"]:focus, input[type="password"]:focus, input[type="number"]:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2); outline: none; }
        .input-group { margin-bottom: 0.8em; }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }

        /* Firefox */
        input[type=number] {
        -moz-appearance: textfield;
        }
        .guidance-section { margin-top: 1.5em; margin-bottom: 1.5em; padding: 1.5em; border: 1px solid var(--border-color); border-radius: 5px; background-color: var(--section-bg); box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .guidance-section h3 { margin-top: 0; }

        /* Layout Helpers */
        .flex-layout { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; }
        .flex-main { flex: 1 1 60%; min-width: 300px; }
        .flex-aside { flex: 1 1 35%; min-width: 250px; padding: 1em; background-color: var(--aside-bg); border: 1px solid var(--aside-border); border-radius: 4px; font-size: 0.9em; }
        .flex-aside h4 { margin-top: 0; color: var(--primary-dark-color); }

        /* OS Info Specific */
        #osInfoContainer { /* Removed transition for simpler show/hide */ }
        #osInfoContainer table { font-size: 0.95em; margin-top: 0.5em; }
        #osInfoContainer ul { padding-left: 15px; margin-top: 0.5em; }
        #osInfoContainer li { margin-bottom: 0.3em; }

        /* DB Specific Layout */
        /* Uses .flex-main and .flex-aside */

            /* Filestore Specific Layout */
        /* Uses .flex-main and .flex-aside */
        #filestoreDetailsContainer p:first-child { margin-top: 0; }
        #filestoreInputsContainer { margin-top: 1em; padding-top: 1em; border-top: 1px dashed var(--border-color); }


        table { width: 100%; border-collapse: collapse; margin-top: 1em; margin-bottom: 1em; font-size: 0.95em; background-color: #fff; }
        th, td { border: 1px solid var(--border-color); padding: 8px 12px; text-align: left; vertical-align: top; }
        th { background-color: var(--table-header-bg); font-weight: bold; }

        details { border: 1px solid var(--border-color); border-radius: 4px; margin-top: 1em; background-color: #fff; }
        summary { padding: 10px 10px 10px 30px; font-weight: bold; cursor: pointer; background-color: var(--details-bg); border-bottom: 1px solid var(--border-color); list-style: none; position: relative; color: #333; }
        summary::before { content: '▶'; position: absolute; left: 10px; top: 50%; transform: translateY(-50%) rotate(0deg); font-size: 0.8em; transition: transform 0.2s ease-in-out; }
        details[open] summary::before { transform: translateY(-50%) rotate(90deg); }
        details > :not(summary) { padding: 15px; border-top: 1px solid var(--border-color); background-color: #fff; }

        .input-row {
            display: flex;
            gap: 1em; 
            align-items: flex-start;
            margin-bottom: 0.8em; 
        }

        .input-row .input-group {
            flex: 1; 
            margin-bottom: 0;
        }
        .input-row .input-group input[type="text"],
        .input-row .input-group input[type="password"],
        .input-row .input-group input[type="number"] {
            max-width: none; /* Allow inputs to fill the flex item's width */
            /* margin-bottom: 0; Remove if handled by .input-group or .input-row */
        }
    

        .info-box { margin-top: 1em; padding: 1em; background-color: var(--highlight-bg); border: 1px solid #c8e6c9; border-radius: 4px; border-left: 5px solid var(--primary-color); }
        .info-box h4 { margin-top: 0; color: var(--primary-dark-color); }
        .info-box p:last-child { margin-bottom: 0; }
        .info-box .highlight { font-weight: bold; color: var(--primary-dark-color); }

        #dbVersionInfo { margin-bottom: 1em; }
        #dbVersionInfo h4 { margin-top: 0; }

        /* Installation Steps Styling */
        #installStepsSection {
            background-color: #f9fafb; /* Light grey background */
            border: 2px solid var(--primary-color); /* Primary green border */
            padding: 2em;
            margin-top: 2em;
        }
        #installStepsSection h3 {
                color: var(--primary-dark-color);
                border-bottom: 2px solid var(--primary-dark-color);
                padding-bottom: 0.3em;
                margin-bottom: 1em;
                font-weight: bold;
        }
        #installStepsContent h4 { border-bottom: none; margin-top: 1.5em; color: #333; }
        #installStepsContent .step { margin-bottom: 1.5em; padding-left: 10px; border-left: 3px solid var(--primary-color); }
        #installStepsContent .ha-note { border: 1px dashed var(--primary-dark-color); background-color: #fff; padding: 0.5em 1em; margin-top: 1em; border-radius: 4px;}


        .hidden { display: none !important; }
        .placeholder { color: #999; font-style: italic; }
        .recommendation { font-weight: bold; color: var(--primary-dark-color); }
        .warning, .db-warning { color: #8a6d3b; background-color: #fcf8e3; border: 1px solid #faebcc; padding: 10px 15px; border-radius: 4px; margin-top: 10px; }
        .db-warning strong { color: #a94442; }

        /* Style for placeholders in code snippets */
        .db-user-placeholder, .db-pass-placeholder, .db-name-placeholder, .db-port-placeholder, .db-host-placeholder {
            font-style: italic;
            color: #007bff;
            font-weight: bold;
        }
            /* Style for cache option explanations */
        .cache-option-desc { font-size: 0.85em; color: #666; margin-top: -0.4em; margin-bottom: 0.8em; display: block; }

        .beta-disclaimer {
            position: absolute; /* Changed to absolute for positioning relative to the nearest positioned ancestor or initial containing block */
            top: 25px;
            right: 25px;
            background-color: #fff3cd; /* Light yellow, common for warnings */
            color: #856404; /* Dark yellow/brown text */
            padding: 8px 12px;
            border: 1px solid #ffeeba; /* Border to match background */
            border-radius: 4px;
            font-size: 0.7em; /* Smaller font size */
            text-align: right;
            z-index: 1000; /* Ensure it's on top of other content */
            max-width: 250px; /* Optional: constrain width */
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Optional: subtle shadow */
        }
    </style>

    <div>
        <p>This tool enables you to select a number of items regarding your specific setup. Then displays personalized guidance to assist you in the set up of your self-hosted Artifactory installation. See here for an overview of the 
        <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/system-architecture" target="_blank">System Architecture</a>.</p>
        <p>To use this tool, select the relevant option that best reflects your required deployment, then follow the suggested specifications.</p>
        
        <div class="beta-disclaimer">
            Please be aware that the content is still under active development and may not be fully complete or accurate. We welcome your feedback to help us enhance its quality.
        </div>

        <div class="guidance-section flex-layout">
            <div class="flex-main">
                <h3>1. Select Installation Method</h3>
                <label for="installSelect">How do you want to install Artifactory?</label>
                <select id="installSelect">
                    <option value="">--Please choose an option--</option>
                    <option disabled>Helm/k8s Coming soon!</option>
                    <option value="rpm">RPM (for RHEL/AmazonLinux)</option>
                    <option value="debian">Debian (for Debian/Ubuntu)</option>
                    <option value="linux">Linux Archive (Manual Install)</option>
                    <option value="docker">Docker</option>
                    <option value="docker-compose">Docker Compose</option>
                </select>
                <div id="dockerHost" class="input-group  hidden "> 
                    <label for="hostName"><span style="color:red; font-weight: bold;">Required: </span> Host machine hostname/IP:</label> <input type="text" id="hostName" placeholder="your_host_ip_or_name"> 
                    <small> This is needed as the container inside the pod can often select an internal docker IP instead of the host IP. Artifactory must know the host machines IP for communication purposes.</small>
                </div>
            </div>
            <div id="osInfoContainer" class="flex-aside hidden"> <h4>Host System Requirements</h4>
                <div id="osInfoContent">
                    <p class="placeholder">Select an installation method to see requirements.</p>
                </div>
            </div>
        </div>

        <div class="guidance-section">
                <h3>2. Select Installation Mode</h3>
                <label for="installModeSelect">Is this a single-node install or High Availability (HA) cluster?</label>
                <select id="installModeSelect">
                    <option value="">--Please choose an option--</option>
                    <option value="singleNode">Single-node</option>
                    <option value="highAvailability">High Availability (Requires Enterprise License)</option>
                </select>
        </div>

        <div class="guidance-section">
            <h3>3. Sizing Requirements</h3>
            <label for="userRangeSelect">Select the approximate number of active users/clients:</label>
            <select id="userRangeSelect">
                <option value="0-20" selected>0-20 Users</option>
                <option value="21-100">21-100 Users</option>
                <option value="101-200">101-200 Users</option>
                <option value="200+">200+ Users (Consult Recommended)</option>
            </select>
            <div id="sizingResults" class="hidden"> <div id="vmSpecs" class="info-box"></div>
                <div id="dbSpecs" class="info-box"></div>
            </div>
                <details>
                <summary>View Detailed Sizing Guidelines</summary>
                <div>
                    <h4>Artifactory Node VM Sizing (Based on Active Clients)</h4>
                    <table><thead><tr><th>Number of Active Clients</th><th>Processor (CPU)</th><th>Memory (RAM)</th></tr></thead><tbody><tr><td>0-20</td><td>4 core CPU</td><td>6 GB</td></tr><tr><td>20-100</td><td>6 core CPU</td><td>12 GB</td></tr><tr><td>100-200</td><td>8 core CPU</td><td>18 GB</td></tr><tr><td>200+</td><td colspan="2">Consult JFrog Sales/Support</td></tr></tbody></table>
                    <h4>External Database Sizing (Mapped from Client Range to T-Shirt Size)</h4>
                    <table><thead><tr><th>Size</th><th>DB Memory</th><th>DB CPU</th><th>Max Connections</th><th>Disk IOPS</th><th>Disk Throughput</th><th>Disk Size</th></tr></thead><tbody><tr><td>XSmall (0-20 Users)</td><td>8 GB</td><td>2</td><td>50</td><td>3k</td><td>250MB/s</td><td>~30% of Binaries</td></tr><tr><td>Small (21-100 Users)</td><td>16 GB</td><td>4</td><td>100</td><td>4k</td><td>400MB/s</td><td>~30% of Binaries</td></tr><tr><td>Medium (101-200 Users)</td><td>32 GB</td><td>8</td><td>200</td><td>6k</td><td>600MB/s</td><td>~30% of Binaries</td></tr><tr><td>Large (200+ Users Start)</td><td>64 GB</td><td>16</td><td>600</td><td>10k</td><td>800MB/s</td><td>~30% of Binaries</td></tr><tr><td>XLarge</td><td>128 GB</td><td>32</td><td>2000</td><td>12k</td><td>1000MB/s</td><td>~30% of Binaries</td></tr><tr><td>2XLarge</td><td>256 GB</td><td>64</td><td>5000</td><td>20k</td><td>1500MB/s</td><td>~30% of Binaries</td></tr></tbody></table>
                </div>
            </details>
            <p><small>Select a user range to see suggested resource specifications.</small></p>
        </div>

        <div id="guidance" class="guidance-section">
            <h3>4. Database Selection & Setup</h3>
            <div class="flex-layout db-layout">
                <div class="flex-main db-main">
                    <p>Artifactory requires a Database for hosting details regarding your deployment. All environment data is stored here except the binaries themselves. The Database should run on a separate host machine or in the cloud for a production environment.</p>
                    <p id="dockerOs" class="docker-os-intro hidden">Docker Compose offers to install an internal Postgres Database as part of the install. <strong>This is not recommended for production.</strong> If you are just setting up a test instance then you may use this internal DB and ignore this section.</p>
                    <p><span class="recommendation">Tip:</span> JFrog highly recommends PostgreSQL for production. See <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-database-requirements" target="_blank">Database Requirements</a>.</p>

                    <label for="dbSelect">Choose your database:</label>
                    <select id="dbSelect">
                        <option value="">--Please choose an option--</option>
                        <option value="postgresql">PostgreSQL (Recommended)</option>
                        <option value="mysql">MySQL</option>
                        <option value="mariadb">MariaDB</option>
                        <option value="mssql">Microsoft SQL Server</option>
                        <option value="oracle">Oracle</option>
                    </select>
                    <div id="dbInputsContainer">
                        <h4>Database Connection Details</h4>
                        <div class="input-row">
                            <div class="input-group"> <label for="dbHostInput">Database Host/IP:</label> <input type="text" id="dbHostInput" value="your_db_host_or_ip"> </div>
                            <div class="input-group"> <label for="dbPortInput">Database Port:</label> <input type="number" id="dbPortInput" value="5432"> </div>
                        </div>
                        <div class="input-row">
                            <div class="input-group"> <label for="dbUserInput">Database Username:</label> <input type="text" id="dbUserInput" value="artifactory"> </div>
                            <div class="input-group"> <label for="dbPasswordInput">Database Password:</label> <input type="password" id="dbPasswordInput" value="password"> </div>
                        </div>

                        <div class="input-group"> <label for="dbNameInput">Database Name:</label> <input type="text" id="dbNameInput" value="artifactory"> </div>
       
                        <p><small>Enter the details for the database you prepared.</small></p>
                    </div>

                    <div id="dbVersionInfo" class="info-box"></div>
                </div>
                <div id="dbPrereqsContainer" class="flex-aside db-aside "> </div>
            </div>
        </div>

        <div class="guidance-section">
            <h3>5. Filestore Configuration</h3>
                <div class="flex-layout filestore-layout">
                <div class="flex-main filestore-main">
                    <label for="filestoreSelect">Choose your binary storage (Filestore) template:</label>
                    <select id="filestoreSelect">
                        <option value="">--Please choose an option--</option>
                        <option value="file-system">Local Storage/NFS (file-system)</option>
                        <option value="cluster-file-system" class="ha-only hidden">HA Local Storage (cluster-file-system)</option>
                        <option value="s3-storage-v3-direct">S3 Object Storage (s3-storage-v3-direct)</option>
                        <option value="azure-blob-storage-v2-direct">Azure Blob Storage (azure-blob-storage-v2-direct)</option>
                        <option value="google-storage-v2-direct">Google Cloud Storage (google-storage-v2-direct)</option>
                    </select>
                    <p><small>There are many more options, we offer the most common options here. See <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/filestore-configuration" target="_blank"> Filestore Configuration Types</a> for more options and details. See here for a <a href="https://jfrog.com/whitepaper/best-practices-for-managing-your-artifactory-filestore-2/" target="_blank"> comprehensive dive</a> into the filestore.</small></p>

                    <div id="filestoreInputsContainer" class="hidden">
                        <hr>
                        <h4>Filestore Configuration Details</h4>
                        <div class="fs-input-group hidden" data-fs-type="file-system cluster-file-system">
                            <div class="input-group">
                                <label for="fsFileStoreDirInput">Custom Filestore Directory (Optional):</label>
                                <input type="text" id="fsFileStoreDirInput" placeholder="$JFROG_HOME/artifactory/var/data/artifactory/filestore">
                                <p><small>Leave blank to use the default path. If using NFS, provide the mount path here.</small></p>
                            </div>
                        </div>
                        <div class="fs-input-group hidden" data-fs-type="s3-storage-v3-direct">
                            <div class="input-row">
                                    <div class="input-group"><label for="s3BucketNameInput">S3 Bucket Name:</label><input type="text" id="s3BucketNameInput"></div>
                                    <div class="input-group"><label for="s3RegionInput">S3 Region:</label><input type="text" id="s3RegionInput" placeholder="e.g., us-east-1"></div>
                            </div>
                            <div class="input-row">
                                    <div class="input-group"><label for="s3EndpointInput">S3 Endpoint (Optional - for Non AWS S3):</label><input type="text" id="s3EndpointInput" placeholder="s3.amazonaws.com"></div>
                                    <div class="input-group"><label for="s3PathPrefixInput">Path Prefix (Optional):</label><input type="text" id="s3PathPrefixInput" placeholder="path/in/bucket"></div>
                            </div>
                            <div class="input-group"><label>Authentication Method:</label>
                                <input type="radio" id="s3AuthIAM" name="s3AuthMethod" value="iam" checked><label for="s3AuthIAM" class="inline-label">IAM Role (Recommended)</label><br>
                                <input type="radio" id="s3AuthKeys" name="s3AuthMethod" value="keys"><label for="s3AuthKeys" class="inline-label">Access Key & Secret Key</label>
                                <div id="s3AuthInfoMessage" class="s3info"></div>
                            </div>
                            <div id="s3KeysInputs" class="hidden">
                                <div class="input-row">
                                <div class="input-group"><label for="s3IdentityInput">AWS Access Key ID:</label><input type="text" id="s3IdentityInput"></div>
                                <div class="input-group"><label for="s3CredentialInput">AWS Secret Access Key:</label><input type="password" id="s3CredentialInput"></div>
                            </div>
                        </div>
                    </div>
                        
                        <div class="fs-input-group hidden" data-fs-type="azure-blob-storage-v2-direct">

                            <div class="input-row">
                                <div class="input-group"><label for="azureContainerNameInput">Container Name:</label><input type="text" id="azureContainerNameInput"></div>
                                <div class="input-group"><label for="azureEndpointInput">Endpoint Suffix (Optional):</label><input type="text" id="azureEndpointInput" placeholder="blob.core.windows.net"></div>
                            </div>
                            <div class="input-row">
                                    <div class="input-group"><label for="azureAccountNameInput">Storage Account Name:</label><input type="text" id="azureAccountNameInput"></div>
                                    <div class="input-group"><label for="azureAccountKeyInput">Storage Account Key:</label><input type="password" id="azureAccountKeyInput"></div>
                                </div>
                                <p><small>Alternatively, configure using a <a href="https://jfrog.com/help/r/artifactory-setting-up-azure-blob-storage-with-a-sas-token/artifactory-setting-up-azure-blob-storage-with-a-sas-token" target="_blank">SAS Token</a> manually.</small></p>
                            </div>

                        <div class="fs-input-group hidden" data-fs-type="google-storage-v2-direct">
                                <div class="input-group"><label for="gcsBucketNameInput">GCS Bucket Name:</label><input type="text" id="gcsBucketNameInput"></div>
                                <div class="input-group"><label for="gcsPathPrefixInput">Path Prefix (Optional):</label><input type="text" id="gcsPathPrefixInput"></div>
                                <div class="input-group">
                                    <input type="checkbox" id="gcsUseInstanceCredentialsInput" checked>
                                    <label for="gcsUseInstanceCredentialsInput" class="inline-label">Use Instance Credentials (Recommended)</label>
                                    <p><small>Uncheck if using GOOGLE_APPLICATION_CREDENTIALS env var or default credentials file path.</small></p>
                                </div>
                            </div>

                        <div id="cacheOptionsContainer">
                            <hr>
                            <h5>Cache</h5>
                            <p><small>Wraps the selected provider with a local cache which saves binaries in <code>$JFROG_HOME/artifactory/var/data/artifactory/cache </code> until the max size is reached, then uses LRU (Least Recently Used) for replacement. JFrog recommends this for NFS or Cloud Storage to improve download performance with fast local storage (SSD). Your cache should be sized for 24 hours of traffic, including some overhead. More details <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/cached-filesystem-binary-provider" target="_blank">here</a>.</small></p>
                            <div class="input-group">
                                    <input type="checkbox" id="fsUseCacheCheckbox">
                                    <label for="fsUseCacheCheckbox" class="inline-label">Enable Local Cache</label>
                                    
                            </div>
                            <div id="cacheParamsContainer" class="hidden">
                                    <div class="input-group">
                                        <label for="fsCacheDirInput">Cache Directory:</label>
                                        <input type="text" id="fsCacheDirInput" value="cache">
                                        <span class="cache-option-desc">Path relative to Artifactory's data directory (<code>$JFROG_HOME/artifactory/var/data/artifactory</code>) where cached files are stored. Using <code>/</code> first will specify a fully qualified path.</span>
                                </div>
                                    <div class="input-group">
                                        <label for="fsMaxCacheSizeInput">Max Cache Size (GB):</label>
                                        <input type="number" id="fsMaxCacheSizeInput" value="5" placeholder="5GB default">
                                        <span class="cache-option-desc">Total size limit for cached files (Please ensure there is overhead beyond this for the local storage as the cache saves files before deleting old ones). Default is 5GB.</span>
                                </div>
                                    <div class="input-group">
                                        <label for="fsMaxFileSizeLimitInput">Max File Size Limit for Cache (GB, optional):</label>
                                        <input type="number" id="fsMaxFileSizeLimitInput" placeholder="No limit default">
                                        <span class="cache-option-desc">Files larger than this will not be cached. Leave blank for no limit.</span>
                                </div>
                                    <div class="input-group">
                                        <input type="checkbox" id="fsSkipDuringUploadCheckbox">
                                        <label for="fsSkipDuringUploadCheckbox" class="inline-label">Skip Caching During Upload</label>
                                        <span class="cache-option-desc">If checked, files are only cached when downloaded, not when uploaded.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div id="filestoreDetailsContainer" class="flex-aside filestore-aside hidden"> </div>
                </div>
            </div>

            <div id="installStepsSection" class="guidance-section"> <h3>Here are your personalized Installation Steps</h3>
            <div id="installStepsContent">
                <p class="placeholder">Select options in all sections above to generate steps.</p>
            </div>
        </div>

    </div> `; // End of template literal

shadowRoot.innerHTML = template;

// ========================================================================
// Data Structures for sizing
// ========================================================================

const vmSpecsData = [ // Based on Active Clients
    { range: '0-20', cpu: '4 core CPU', ram: '6 GB' },
    { range: '21-100', cpu: '6 core CPU', ram: '12 GB' },
    { range: '101-200', cpu: '8 core CPU', ram: '18 GB' },
    { range: '200+', cpu: 'Consult JFrog Sales/Support', ram: 'Consult JFrog Sales/Support' }
];

const dbSpecsData = { // Mapped to T-Shirt Sizes
    xsmall: { name: 'XSmall', memory: '8 GB', cpu: '2', connections: 100, iops: '3k', throughput: '250MB/s', disk: '~30%' },
    small:  { name: 'Small', memory: '16 GB', cpu: '4', connections: 100, iops: '4k', throughput: '400MB/s', disk: '~30%' },
    medium: { name: 'Medium', memory: '32 GB', cpu: '8', connections: 200, iops: '6k', throughput: '600MB/s', disk: '~30%' },
    large:  { name: 'Large', memory: '64 GB', cpu: '16', connections: 600, iops: '10k', throughput: '800MB/s', disk: '~30%' },
    xlarge: { name: 'XLarge', memory: '128 GB', cpu: '32', connections: 2000, iops: '12k', throughput: '1000MB/s', disk: '~30%' },
    '2xlarge':{ name: '2XLarge', memory: '256 GB', cpu: '64', connections: 5000, iops: '20k', throughput: '1500MB/s', disk: '~30%' },
        consult: { name: 'Custom/Consult', memory: 'Consult JFrog', cpu: 'Consult JFrog', connections: 0, iops: 'Consult', throughput: 'Consult', disk: 'Consult' }
};

function getTshirtSizeFromClientRange(range) {
    switch(range) {
        case '0-20': return 'xsmall';
        case '21-100': return 'small';
        case '101-200': return 'medium';
        case '200+': return 'large'; 
        default: return 'small';
    }
};

const tuningParamsData = { // DB Pool and Max Threads based on T-Shirt Size
    xsmall: { artifactoryMaxThreads: 200, accessMaxThreads: 100, artidbPool: 100, otherdbPool: 50 },
    small:  { artifactoryMaxThreads: 200, accessMaxThreads: 100, artidbPool: 100, otherdbPool: 100 },
    medium: { artifactoryMaxThreads: 600, accessMaxThreads: 150, artidbPool: 200, otherdbPool: 100 },
    large:  { artifactoryMaxThreads: 800, accessMaxThreads: 200, artidbPool: 300, otherdbPool: 100 },
    xlarge: { artifactoryMaxThreads: 2048, accessMaxThreads: 300, artidbPool: 600, otherdbPool: 150 },
    '2xlarge':{ artifactoryMaxThreads: 2048, accessMaxThreads: 300, artidbPool: 1000, otherdbPool: 150 },
    consult: { artifactoryMaxThreads: 2048, accessMaxThreads: 300, artidbPool: 600, otherdbPool: 150 } // Use xlarge as base for consult
};

// ========================================================================
// State Management Variable Defaults
// ========================================================================

let selections = {
    installType: '',
    hostName: '',
    installMode: 'singleNode',
    userRange: '0-20',
    tShirtSize: 'xsmall',
    vmSpec: null,
    dbSpec: null,
    artidbPool: null,
    otherdbPool: null,
    artifactoryMaxThreads: null,
    accessMaxThreads: null,
    dbChoice: 'postgresql',
    dbHost: 'your_db_host_or_ip',
    dbPort: '5432',
    dbName: 'artifactory',
    dbUser: 'artifactory',
    dbPassword: 'password',
    filestoreChoice: 'file-system',
    fsFileStoreDir: '',
    fsUseCache: false,
    fsCacheDir: 'cache',
    fsMaxCacheSize: '5',
    fsMaxFileSizeLimit: '',
    fsSkipDuringUpload: false,
    s3BucketName: '',
    s3Endpoint: 's3.amazonaws.com',
    s3PathPrefix: '',
    s3Region: '',
    s3AuthMethod: 'iam',
    s3Identity: '',
    s3Credential: '',
    azureAccountName: '',
    azureAccountKey: '',
    azureContainerName: '',
    azureEndpoint: 'blob.core.windows.net',
    gcsBucketName: '',
    gcsPathPrefix: '',
    gcsUseInstanceCredentials: true
};

// ========================================================================
// Artifactory Version Fetching
// ========================================================================

// Initialize the variable that will hold the version
let artifactoryVersion = '&lt;version&gt;'
;

/**
 * Attempts to fetch the Artifactory version from FluidTopics metadata.
 * @returns {Promise<string>} A promise that resolves with the version string if found.
 * @throws {Error} Rejects the promise if the API is unavailable or the data is not found.
 */
function getVersionFromMetadata() {
  return new Promise((resolve, reject) => {
      // Check if the FluidTopics API is available on the window object
      if (!window.fluidtopics || !window.fluidtopics.FluidTopicsApi) {
        return reject(new Error("FluidTopics API not available."));
      }
      resolve(new window.fluidtopics.FluidTopicsApi());
    })
    .then(FTAPI => {
      FTAPI["ftCallingApp"] = "artifactory-install-helper"; // Set a caller ID
      const body = {
        "filters": [{
          "key": "ft:originId",
          "values": ["artifactory-install-helper"]
        }, {
          "key": "ft:sourceId",
          "values": ["interactive_content"]
        }]
      };
      return FTAPI.post('/api/khub/maps/search', body);
    })
    .then(searchResult => {
     // Check for a valid result with metadata
      if (searchResult && searchResult.results && searchResult.results.length > 0 && Array.isArray(searchResult.results[0].metadata)) {
        debugLog("Success: Found Interactive KB Metadata");
        // Find the specific metadata object with the key 'ArtifactoryLatestVersion'
        const versionMetadata = searchResult.results[0].metadata.find(meta => meta.key === 'ArtifactoryLatestVersion');

        // Check if we found the version object and if it has a value
        if (versionMetadata && versionMetadata.values && versionMetadata.values.length > 0) {
          const version = versionMetadata.values[0];
          debugLog(`Successfully extracted version from metadata: ${version}`);
          return version; // Resolve the promise with the found version
        } else {
          // The metadata was found, but the specific version key was missing or empty.
          throw new Error("Metadata found, but 'ArtifactoryLatestVersion' key was not present or had no value.");
        }
      } else {
        throw new Error("Map 'artifactory-install-helper' not found or no results matching the criteria.");
      }
    });
}

/**
 * Fetches the latest Artifactory release version from the JFrog versions endpoint in the mill.
 * This function is used as a fallback.
 * @returns {Promise<string>} A promise that resolves with the latest version string.
 */
async function getLatestArtifactoryRelease() {
  const url = 'http://mill.jfrog.info/artifactory/versions';

  try {
    debugLog("Attempting to fetch latest version from fallback URL...");
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch from ${url}.`);
    }

    const allTags = await response.json();
    const versions = [];

    // Filter for tags that match a semantic versioning pattern (e.g., 7.80.6)
    allTags.forEach(tag => {
      if (/^\d+(\.\d+){1,2}$/.test(tag)) {
        versions.push(tag);
      }
    });

    if (versions.length === 0) {
      debugLog("Fallback failed: No valid versions found in the response.");
      return '&lt;version&gt;';
    }

    // Sort versions to find the latest one
    versions.sort((v1, v2) => {
      const parts1 = v1.split('.').map(Number);
      const parts2 = v2.split('.').map(Number);
      for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return -1;
        if (p1 < p2) return 1;
      }
      return 0;
    });

    debugLog(`Success: Fallback found latest version: ${versions[0]}`);
    return versions[0];

  } catch (error) {
    debugLog("Error during fallback version fetch:", error);
    return '&lt;version&gt;'; // Return default value if fallback also fails
  }
}

// ========================================================================
// Main Execution Logic
// ========================================================================

(async () => {
  try {
    // First, try to get the version from metadata
    artifactoryVersion = await getVersionFromMetadata();
  } catch (error) {
    // If getting from metadata fails for any reason, log it and try the fallback
    debugLog(`Metadata check failed: ${error.message}.`);
    artifactoryVersion = await getLatestArtifactoryRelease();
  }
  
  // For demonstration: show the final version
  debugLog(`Final determined Artifactory Version: ${artifactoryVersion}`);
})();

// ========================================================================
// DB Details Variable
// ========================================================================

const dbDetails = {
    postgresql: { 
        versions: "16.x (from Artifactory 7.98), 15.x (from 7.68), 14.x (from 7.68), 13.x",
        prerequisites:
        `<h4>PostgreSQL Prerequisite Setup </h4>
        <p>On your Postgres instance run the following commands:</p>
        <pre><button class="copy-button" title="Copy SQL">Copy</button><code>CREATE USER <span class="db-user-placeholder">artifactory</span> WITH PASSWORD '<span class="db-pass-placeholder">password</span>';\nCREATE DATABASE <span class="db-name-placeholder">artifactory</span> WITH OWNER=<span class="db-user-placeholder">artifactory</span> ENCODING='UTF8';\nGRANT ALL PRIVILEGES ON DATABASE <span class="db-name-placeholder">artifactory</span> TO <span class="db-user-placeholder">artifactory</span>;</code></pre>
        <hr>
        <p><strong>For self-managed PostgreSQL instances (not RDS):</strong><br>
        To allow remote connections, add the following to your <code>pg_hba.conf</code> file:</p>
        <pre><button class="copy-button" title="Copy Config">Copy</button><code>host  <span class="db-name-placeholder">artifactory</span>  <span class="db-user-placeholder">artifactory</span>  &lt;artifactory_ip_cidr&gt;   md5</code></pre>
        <p>And ensure <code>listen_addresses = '*'</code> (or specific IPs) is set in <code>postgresql.conf</code>. Restart PostgreSQL after these changes.</p>
        <p><span class="recommendation">Reference: </span><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/create-the-artifactory-postgresql-database" target="_blank">Artifactory PostgreSQL Setup Guide</a></p>

        <hr>
        <p><strong>Securing the Connection with SSL:</strong><br>
        It is possible to secure the connection between Artifactory and PostgreSQL using TLS/SSL.</p>
        <p>To do so you will need the CA cert from your database, saved onto your Artifactory machine. <strong>For AWS RDS, SSL is typically enabled by default</strong>. Download the appropriate AWS RDS CA certificate from the <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html#UsingWithRDS.SSL.CertificatesDownload" target="_blank">AWS documentation</a> to use as the <code>sslrootcert</code>.
        <p>It will also be necessary to update the database URL snippet we generate below in the <code>system.yaml</code> with:</p>
        <pre><button class="copy-button" title="Copy YAML Snippet">Copy</button><code>url: 'jdbc:postgresql://<span class="db-host-placeholder">your_db_host</span>:<span class="db-port-placeholder">5432</span>/<span class="db-name-placeholder">artifactory</span>?sslmode=verify-full&sslrootcert=/path/to/your/server_or_ca_certificate.pem'</code></pre>

        <p>For more details, see the <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/enable-tls-encryption-for-postgresql" target="_blank">PostgreSQL TLS Documentation</a>.</p>`,
        driver:``
    },
    mysql: { 
        versions: "8.x (InnoDB engine required)",
        prerequisites: `<h4>MySQL Prerequisite Setup</h4>
        <p>Run the following SQL commands:</p><pre><button class="copy-button" title="Copy SQL">Copy</button><code>CREATE DATABASE <span class="db-name-placeholder">artdb</span> CHARACTER SET utf8 COLLATE utf8_bin;\nCREATE USER '<span class="db-user-placeholder">artifactory</span>'@'%' IDENTIFIED BY '<span class="db-pass-placeholder">password</span>';\nGRANT ALL on <span class="db-name-placeholder">artdb</span>.* TO '<span class="db-user-placeholder">artifactory</span>'@'%';\nGRANT SUPER ON *.* TO '<span class="db-user-placeholder">artifactory</span>'@'%';\nFLUSH PRIVILEGES;</code></pre>
        <p><strong>Important:</strong> Ensure case-sensitive collation (<code>utf8_bin</code> is recommended). UTF8MB4 is not supported.</p>
        <p>For remote connectivity, edit <code>my.cnf</code> (or similar) and set <code>bind-address = 0.0.0.0</code> (or specific IPs). Restart MySQL after changes.</p>
        <p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/create-the-artifactory-mysql-database" target="_blank">Artifactory MySQL Setup Guide</a></p>`,
        driver:`true`
    },
    mariadb: { 
        versions: "10.5, 10.6", 
        prerequisites: `<h4>MariaDB Prerequisite Setup</h4>
            <p>Artifactory provides a script that will execute the SQL commands you need to create your MariaDB database. You can find the script in $JFROG_HOME/artifactory/app/misc/db/createdb/createdb_mariadb.sql. You should review the script and modify it as needed to correspond to your specific environment or :-</p> 
            <p>Copy and run the following SQL commands:</p>
            <pre><button class="copy-button" title="Copy SQL">Copy</button><code>CREATE DATABASE <span class="db-name-placeholder">artdb</span> CHARACTER SET utf8 COLLATE utf8_bin;\nGRANT ALL on <span class="db-name-placeholder">artdb</span>.* TO '<span class="db-user-placeholder">artifactory</span>'@'%' IDENTIFIED BY '<span class="db-pass-placeholder">password</span>';\nGRANT SUPER ON *.* TO '<span class="db-user-placeholder">artifactory</span>'@'%';\nFLUSH PRIVILEGES;</code></pre>
            <p><strong>Important:</strong> Ensure case-sensitive collation (<code>utf8_bin</code> is recommended).</p>
            <p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/create-the-artifactory-mariadb-database" target="_blank">Artifactory MariaDB Setup Guide</a></p>`, 
        driver:`true` 
    },
    mssql: { 
        versions: "2012 and later",
        prerequisites: `<h4>Microsoft SQL Server Prerequisite Setup</h4>
            <p>Using SQL Server Management Studio (SSMS):</p>
            <ol>
                <li>Create a new Login named '<span class="db-user-placeholder">artifactory</span>' with SQL Server authentication and set a password.</li>
                <li>Create a new Database named '<span class="db-name-placeholder">artifactory</span>'.</li>
                <li>Set the Owner of the '<span class="db-name-placeholder">artifactory</span>' database to the '<span class="db-user-placeholder">artifactory</span>' login created in step 1.</li>
                <li>In the Database Properties -> Options page, set the <strong>Collation</strong> to <code>Latin1_General_CS_AI</code> (Case-Sensitive).</li>
                <li>Ensure the Artifactory server(s) can connect (check firewall, SQL Server network configuration for TCP/IP).</li>
            </ol>
            <p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/create-the-artifactory-microsoft-sql-server-database" target="_blank">Artifactory MS SQL Setup Guide</a></p>`,
            driver:`true`
    },
    oracle: { 
        versions: "19c",
        prerequisites: `<h4>Oracle Prerequisite Setup</h4>
                    <p>You will have to create a DB and provide us with the DB details. Usually it’s easiest to grant full access, if this is not possible then Run the following SQL commands:</p><pre><button class="copy-button" title="Copy SQL">Copy</button><code>CREATE USER <span class="db-user-placeholder">artifactory</span> IDENTIFIED BY <span class="db-pass-placeholder">password</span> \nDEFAULT TABLESPACE "USERS" \nTEMPORARY TABLESPACE "TEMP";\n\nGRANT "CONNECT" TO <span class="db-user-placeholder">artifactory</span>;\nGRANT "RESOURCE" TO <span class="db-user-placeholder">artifactory</span>; \nGRANT CREATE SESSION TO <span class="db-user-placeholder">artifactory</span>; \nGRANT CREATE SEQUENCE TO <span class="db-user-placeholder">artifactory</span>; \nALTER USER <span class="db-user-placeholder">artifactory</span> QUOTA UNLIMITED ON USERS;</code></pre><p>Ensure the database character set supports UTF8.</p><p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/create-the-artifactory-oracle-database" target="_blank">Artifactory Oracle Setup Guide</a></p>`,
        driver:`true`
    }
};

// ========================================================================
// Filestore Details Variable
// ========================================================================

const cloudStorageTypes = ['s3-storage-v3-direct', 'azure-blob-storage-v2-direct', 'google-storage-v2-direct'];

const filestoreDetails = {
    'file-system': { description: `The most basic filestore configuration. Uses a local directory or a mounted network file system (NFS). Simple to set up but performance depends heavily on the underlying storage speed and IOPS. Default for single-node.<p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/file-system-binary-provider-template-configuration" target="_blank">Full guide for file-system</a></p>` },
    'cluster-file-system': { description: `The default for HA set ups. Each node has its own local filestore (just like in the file-system binary provider) and is also connected to all other cluster nodes and can access their storage. Every binary is saved in 2 different nodes by default (Redundancy 2) <p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/configure-sharding-for-ha-cluster" target="_blank">Full guide for cluster-file-system</a></p>` },
    's3-storage-v3-direct': { description: `Uses Amazon S3 (or S3-compatible storage, <b>for enterprise customers only</b>) as the primary binary storage. Leverages the scalability, durability, and cost-effectiveness of S3. Requires AWS credentials and bucket configuration. Supports direct download optimizations.<a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/configure-artifactory-to-use-s3-storage" target="_blank">Full JFrog S3 Documentation.</a>` },
    'azure-blob-storage-v2-direct': { description: `Uses Azure Blob Storage as the primary binary storage. Provides scalability and durability benefits similar to S3 within the Azure ecosystem. Requires Azure storage account details. <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/azure-blob-storage-v2-binary-provider" target="_blank">Full JFrog Azure Blob Storage Documentation.</a>` },
    'google-storage-v2-direct': { description: `Uses Google Cloud Storage (GCS) as the primary binary storage. Offers scalability and integration within the Google Cloud Platform. Requires GCS credentials and bucket configuration <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/google-storage-binary-provider-native-client-template" target="_blank">Full JFrog Google Cloud Storage Documentation.</a>` }
};


// --- Get Element References ---

const installSelect = shadowRoot.getElementById('installSelect');
const dockerHost = shadowRoot.getElementById('dockerHost');
const hostName = shadowRoot.getElementById('hostName');
const installModeSelect = shadowRoot.getElementById('installModeSelect');
const osInfoContainer = shadowRoot.getElementById('osInfoContainer');
const osInfoContent = shadowRoot.getElementById('osInfoContent');
const dockerIntro = shadowRoot.getElementById('dockerOs');
const userRangeSelect = shadowRoot.getElementById('userRangeSelect');
const sizingResults = shadowRoot.getElementById('sizingResults');
const vmSpecsDiv = shadowRoot.getElementById('vmSpecs');
const dbSpecsDiv = shadowRoot.getElementById('dbSpecs');
const dbSelect = shadowRoot.getElementById('dbSelect');
const dbHostInput = shadowRoot.getElementById('dbHostInput');
const dbPortInput = shadowRoot.getElementById('dbPortInput');
const dbNameInput = shadowRoot.getElementById('dbNameInput');
const dbUserInput = shadowRoot.getElementById('dbUserInput');
const dbPasswordInput = shadowRoot.getElementById('dbPasswordInput');
const dbVersionInfo = shadowRoot.getElementById('dbVersionInfo');
const dbPrereqsContainer = shadowRoot.getElementById('dbPrereqsContainer');
const filestoreSelect = shadowRoot.getElementById('filestoreSelect');
const filestoreDetailsContainer = shadowRoot.getElementById('filestoreDetailsContainer');
const filestoreInputsContainer = shadowRoot.getElementById('filestoreInputsContainer');
const fsInputGroups = shadowRoot.querySelectorAll('#filestoreInputsContainer .fs-input-group');
const fsFileStoreDirInput = shadowRoot.getElementById('fsFileStoreDirInput');
const s3BucketNameInput = shadowRoot.getElementById('s3BucketNameInput');
const s3RegionInput = shadowRoot.getElementById('s3RegionInput');
const s3EndpointInput = shadowRoot.getElementById('s3EndpointInput');
const s3PathPrefixInput = shadowRoot.getElementById('s3PathPrefixInput');
const s3AuthInfoMessage = shadowRoot.getElementById('s3AuthInfoMessage');
const s3AuthRadios = shadowRoot.querySelectorAll('input[name="s3AuthMethod"]');
const s3KeysInputs = shadowRoot.getElementById('s3KeysInputs');
const s3IdentityInput = shadowRoot.getElementById('s3IdentityInput');
const s3CredentialInput = shadowRoot.getElementById('s3CredentialInput');
const azureAccountNameInput = shadowRoot.getElementById('azureAccountNameInput');
const azureAccountKeyInput = shadowRoot.getElementById('azureAccountKeyInput');
const azureContainerNameInput = shadowRoot.getElementById('azureContainerNameInput');
const azureEndpointInput = shadowRoot.getElementById('azureEndpointInput');
const gcsBucketNameInput = shadowRoot.getElementById('gcsBucketNameInput');
const gcsPathPrefixInput = shadowRoot.getElementById('gcsPathPrefixInput');
const gcsUseInstanceCredentialsInput = shadowRoot.getElementById('gcsUseInstanceCredentialsInput');
const cacheOptionsContainer = shadowRoot.getElementById('cacheOptionsContainer');
const fsUseCacheCheckbox = shadowRoot.getElementById('fsUseCacheCheckbox');
const cacheParamsContainer = shadowRoot.getElementById('cacheParamsContainer');
const fsCacheDirInput = shadowRoot.getElementById('fsCacheDirInput');
const fsMaxCacheSizeInput = shadowRoot.getElementById('fsMaxCacheSizeInput');
const fsMaxFileSizeLimitInput = shadowRoot.getElementById('fsMaxFileSizeLimitInput');
const fsSkipDuringUploadCheckbox = shadowRoot.getElementById('fsSkipDuringUploadCheckbox');
const installStepsSection = shadowRoot.getElementById('installStepsSection');
const installStepsContent = shadowRoot.getElementById('installStepsContent');


// ========================================================================
// Helper Functions 
// ========================================================================

// Helper function for conditional logging
function debugLog(...args) {
    if (isDebugMode) {
        console.log(...args);
    }
}

function updateOsInfoContent() {
    const installType = selections.installType;
    let content = '<p class="placeholder">Select an installation method first.</p>';
    dockerHost.classList.add('hidden');
    dockerIntro.classList.add('hidden');

    if (installType === 'docker' || installType === 'docker-compose') { 
        dockerHost.classList.remove('hidden');
        content = `<ul>
                        <li><strong>Docker Engine:</strong> v20.10.10 or above</li>${installType === 'docker-compose' ? '<li><strong>Docker Compose:</strong> v1.24 or above</li>' : ''}
                        <li><strong>Host OS:</strong> Any OS supported by Docker Engine (Linux, macOS, Windows).</li>
                    </ul>
                    <p><a href="https://docs.docker.com/engine/install/" target="_blank">Docker Install Docs</a></p>`; 
        if(installType === 'docker-compose'){
            dockerIntro.classList.remove('hidden');
        }
    }
    else if (installType === 'rpm') { content = `<p>Supported Linux Distributions:</p><ul><li><strong>RHEL:</strong> 8.x, 9.x</li><li><strong>Amazon Linux:</strong> 2023</li><li>(Also compatible with CentOS, Fedora derivatives)</li></ul><p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-system-requirements-and-platform-support" target="_blank">Full System Requirements</a></p>`; }
    else if (installType === 'debian') { content = `<p>Supported Linux Distributions:</p><ul><li><strong>Debian:</strong> 11.x, 12.x</li><li><strong>Ubuntu:</strong> 20.04, 22.04, 24.04</li></ul><p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-system-requirements-and-platform-support" target="_blank">Full System Requirements</a></p>`; }
    else if (installType === 'linux') { content = `<p>Requires a compatible Linux host system and Java (JDK) installed separately.</p><table><thead><tr><th>Debian</th><th>RHEL</th><th>Ubuntu</th><th>Amazon Linux</th></tr></thead><tbody><tr><td>11.x, 12.x</td><td>8.x, 9.x</td><td>20.04, 22.04, 24.04</td><td>Amazon Linux 2023</td></tr></tbody></table><p><a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-system-requirements-and-platform-support" target="_blank">Full System Requirements</a></p>`; }
    
    osInfoContent.innerHTML = content;
    
    if (installType) {osInfoContainer.classList.remove('hidden');}
    else { osInfoContainer.classList.add('hidden'); }
}

function updateDbDetails() {
    const dbType = selections.dbChoice;
    const installType = selections.installType;
    debugLog("Updating DB Details for type:", dbType);


    
    const details = dbDetails[dbType];
    let prereqHTML = '';
    prereqHTML = details.prerequisites;
    prereqHTML = prereqHTML.replace(/<span class="db-user-placeholder">.*?<\/span>/g, `<span class="db-user-placeholder">${selections.dbUser || 'artifactory'}</span>`)
                                .replace(/<span class="db-pass-placeholder">.*?<\/span>/g, `<span class="db-pass-placeholder">${selections.dbPassword || 'password'}</span>`)
                                .replace(/<span class="db-host-placeholder">.*?<\/span>/g, `<span class="db-host-placeholder">${selections.dbHost || 'your_db_host_or_ip'}</span>`)
                                .replace(/<span class="db-port-placeholder">.*?<\/span>/g, `<span class="db-port-placeholder">${selections.dbPort || '5432'}</span>`)
                                .replace(/<span class="db-name-placeholder">.*?<\/span>/g, `<span class="db-name-placeholder">${selections.dbName || (dbType === 'postgresql' || dbType === 'mssql' || dbType === 'oracle' ? 'artifactory' : 'artdb')}</span>`);

    dbVersionInfo.innerHTML = `<h4>Supported Versions</h4><p>${details.versions || 'N/A'}</p>`; 
    dbPrereqsContainer.innerHTML = prereqHTML || '<p class="placeholder">No specific setup steps provided.</p>';

            
    dbPrereqsContainer.querySelectorAll('.copy-button').forEach(button => { button.onclick = handleCopyClick; });

}

function updateFilestoreDetails() {

    const fsType = selections.filestoreChoice;
    debugLog("Updating Filestore Details for type:", fsType);

    const isCloudStorage = cloudStorageTypes.includes(fsType);

    if (filestoreInputsContainer) filestoreInputsContainer.classList.toggle('hidden', !fsType);
    if (filestoreDetailsContainer) filestoreDetailsContainer.classList.toggle('hidden', !fsType);

    if (!fsType) { 
        if (filestoreDetailsContainer) filestoreDetailsContainer.innerHTML = '';
        if (cacheOptionsContainer) cacheOptionsContainer.classList.add('hidden');
        if (cacheParamsContainer) cacheParamsContainer.classList.add('hidden');
        return;
    }

    if (cacheOptionsContainer) {
        cacheOptionsContainer.classList.remove('hidden');
    }

    if (cacheParamsContainer) {
        cacheParamsContainer.classList.toggle('hidden', !selections.fsUseCache);
    }


    if (fsInputGroups && typeof fsInputGroups.forEach === 'function') {
        fsInputGroups.forEach(group => {
            const applicableTypes = group.dataset.fsType?.split(' ') || [];
            group.classList.toggle('hidden', !applicableTypes.includes(fsType));
        });
    }

    if (s3KeysInputs) {
        if (fsType === 's3-storage-v3-direct') {
            s3KeysInputs.classList.toggle('hidden', !(selections.hasOwnProperty('s3AuthMethod') && selections.s3AuthMethod === 'keys'));
        } else {
            s3KeysInputs.classList.add('hidden');
        }
    }

    let finalHtml = '';
    const title = fsType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Direct', '(Direct)').replace('V3', 'v3').replace('V2', 'v2');
    finalHtml = `<h4>${title} Details</h4>`;


    if (filestoreDetails && filestoreDetails[fsType]) {
        const details = filestoreDetails[fsType];
        finalHtml += `<p>${details.description}</p>`;

        if (fsType === 'file-system' || fsType === 'cluster-file-system') {

            finalHtml += `<p><strong>(Optional) NFS Mounting</strong></p>`
            if( selections.installMode === 'highAvailability' && fsType === 'file-system'){
                finalHtml += `<strong>Important: </strong>With this option each node has no access to the other nodes storage. You must mount the same external storage to both nodes so they share the same storage location.`
            }
            finalHtml += `<p>If you are using NFS, you can either:
                <ul>
                <li>Mount directly to the default path (<code>$JFROG_HOME/artifactory/var/data/artifactory/filestore</code>)</li>
                <li>Mount elsewhere and update 'Custom Filestore Directory'.</li>
                <li>Use a symlink to connect the default location to the mounted location.</li>
                </ul>
            </p>`;
        }
        if (fsType === 'google-storage-v2-direct') {
            finalHtml += `<p><strong>GCS Auth:</strong> Authentication uses Google Application Default Credentials. Set the <code>GOOGLE_APPLICATION_CREDENTIALS</code> environment variable, use attached service accounts (check 'Use Instance Credentials'), or place the key file at <code>$JFROG_HOME/artifactory/var/etc/artifactory/gcp.credentials.json</code>.</p>`;
        }
        if (fsType === 's3-storage-v3-direct' && selections.s3AuthMethod === 'iam') {
            finalHtml += `<hr><p>You will need to connect the IAM role to your EC2 instance For information on connecting to an EC2 instance, click <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html target="_blank">here.</a></p>
            <p><strong>IAM Role Permissions:</strong> Ensure the IAM role attached to the Artifactory instance has necessary S3 permissions. <br>Either the pre-made policy <strong>AmazonS3FullAccess</strong> or<br>A custom policy with these action permissions: <code>s3:ListBucket, s3:ListBucketVersions, s3:ListBucketMultipartUploads, s3:GetBucketLocation, s3:GetObject, s3:GetObjectVersion, s3:PutObject, s3:DeleteObject, s3:ListMultipartUploadParts, s3:AbortMultipartUpload, s3:ListAllMyBuckets, s3:CreateBucket </code></p> `;
        }
    } else {
        if (!isCloudStorage) { 
                finalHtml += `<p>Further configuration details for this filestore type may apply.</p>`;
        }
    }
    if (isCloudStorage) {
        finalHtml += `<hr><p>This setup configures the direct upload mechanism for your cloud storage. There is an eventual mechanism which is not recommended. You can learn more  <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/aws-s3-object-storage#:~:text=Direct%20(Eventual%2Dless)%20versus%20Eventual%20Upload%20Mechanism" target="_blank">here</a></p>
        <hr><p style="color: #006400; font-weight: bold;">Cache is highly recommended when a cloud storage option is selected, so has been automatically enabled.</p>`;
    }

    if (filestoreDetailsContainer) filestoreDetailsContainer.innerHTML = finalHtml;

    debugLog("Filestore Details Container hidden:", filestoreDetailsContainer && filestoreDetailsContainer.classList.contains('hidden'));
}


function updateSizingInfo() {
    const range = selections.userRange;
    if (!range) {
        vmSpecsDiv.innerHTML = '<p class="placeholder">Select a user range.</p>';
        dbSpecsDiv.innerHTML = '';
        sizingResults.classList.add('hidden');
        return;
    }
    sizingResults.classList.remove('hidden');

    const vmSpec = vmSpecsData.find(spec => spec.range === range);
    const tShirtSize = getTshirtSizeFromClientRange(range);
    const dbSpec = dbSpecsData[tShirtSize];
    const tuningParams = tuningParamsData[tShirtSize] || tuningParamsData.small;

    const isConsult = range === '200+';
    const consultNoteDb = `<p class="warning"><strong>Note:</strong> Sizing guidelines are estimates. Monitor your instance under load and adjust resources and tuning parameters (like DB connections, threads, JVM memory) as needed. ${isConsult ? '<strong>Consultation with JFrog Sales or Support is strongly recommended for 200+ user scale.</strong>' : ''}</p>`;

    selections.vmSpec = vmSpec;
    selections.dbSpec = dbSpec;
    selections.tShirtSize = tShirtSize;
    selections.artidbPool = tuningParams?.artidbPool;
    selections.otherdbPool = tuningParams?.otherdbPool;
    selections.artifactoryMaxThreads = tuningParams?.artifactoryMaxThreads;
    selections.accessMaxThreads = tuningParams?.accessMaxThreads;

    if (vmSpec) {
        vmSpecsDiv.innerHTML = `<h4>Suggested Artifactory Node Specs</h4>
                                <p>For <span class="highlight">${range}</span> Users:</p>
                                <ul>
                                    <li>CPU: <span class="highlight">${vmSpec.cpu}</span></li>
                                    <li>Memory (RAM): <span class="highlight">${vmSpec.ram}</span></li>
                                </ul>`;
    } else {
            vmSpecsDiv.innerHTML = '<p class="warning">Could not determine VM specs for the selected range.</p>';
    }

    if (dbSpec) {
        dbSpecsDiv.innerHTML = `<h4>Suggested External Database Specs (<span class="highlight">${dbSpec.name}</span> Size)</h4>
                                <ul>
                                    <li>DB Memory (RAM): <span class="highlight">${dbSpec.memory}</span></li>
                                    <li>DB CPU Cores: <span class="highlight">${dbSpec.cpu}</span></li>
                                    <li>Disk IOPS: <span class="highlight">${dbSpec.iops}</span></li>
                                    <li>Disk Throughput: <span class="highlight">${dbSpec.throughput}</span></li>
                                    <li>Disk Size: <span class="highlight">${dbSpec.disk}</span> est. binary storage</li>
                                </ul> ${consultNoteDb}`;
    } else {
            dbSpecsDiv.innerHTML = `<p class="warning">Could not determine DB specs for T-shirt size: ${tShirtSize}</p>`;
    }
}

// ========================================================================
// system.yaml GENERATOR SECTION
// ========================================================================

function generateSystemYamlSnippet(selections) {
    const { dbChoice, dbUser, dbPassword, dbHost, dbPort, dbName, tShirtSize, installMode, accessMaxThreads, artifactoryMaxThreads, artidbPool,otherdbPool , installType, hostName } = selections;
    const artifactoryBaseJavaOpts = `-XX:InitialRAMPercentage=40 -XX:MaxRAMPercentage=70`;
    const accessBaseJavaOpts = `-XX:InitialRAMPercentage=10 -XX:MaxRAMPercentage=25`; 
    const artifactoryExtraJavaOpts = accessMaxThreads ? `${artifactoryBaseJavaOpts} -Dartifactory.access.client.max.connections=${accessMaxThreads}` : artifactoryBaseJavaOpts;
    
    // Define the ASCII art header
    const asciiArtHeader = [
        '# =======================================================',
        '#      This YAML config was created by the          ',
        '#           Artifactory Install Helper              ',
        '# =======================================================',
        '' // Adds a blank line after the header for nice spacing
    ];

    let yamlLines = [...asciiArtHeader]; // Initialize yamlLines with the header

        // --- Shared Section ---
        let sharedSubItems = [];
        let nodeConfigLines = [];  

        if (installMode === 'highAvailability') {
            nodeConfigLines.push(`    haEnabled: true`);
            nodeConfigLines.push(`    taskAffinity: any`);
        }
        
        if ((installType === 'docker' || installType === 'docker-compose') ) {
            nodeConfigLines.push(`    ip: ${hostName}`);
        }

        if (nodeConfigLines.length > 0) {
            sharedSubItems.push(`  node:`); 
            sharedSubItems = sharedSubItems.concat(nodeConfigLines);
        }

        if (dbChoice) {
            const effectiveDbUser = dbUser || 'artifactory';
            const effectiveDbPassword = dbPassword || 'password';
            const effectiveDbHost = dbHost || '<your_db_host_or_ip>';
            const effectiveDbPort = dbPort || '';
            let effectiveDbName = dbName || '';
            if (!effectiveDbName) { effectiveDbName = (dbChoice === 'postgresql' || dbChoice === 'mssql' || dbChoice === 'oracle') ? 'artifactory' : 'artdb'; }
            const dbUrlMap = { postgresql: `jdbc:postgresql://${effectiveDbHost}:${effectiveDbPort}/${effectiveDbName}`, mysql: `jdbc:mysql://${effectiveDbHost}:${effectiveDbPort}/${effectiveDbName}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false`, mariadb: `jdbc:mariadb://${effectiveDbHost}:${effectiveDbPort}/${effectiveDbName}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false`, mssql: `jdbc:sqlserver://${effectiveDbHost}:${effectiveDbPort};databaseName=${effectiveDbName}`, oracle: `jdbc:oracle:thin:@//${effectiveDbHost}:${effectiveDbPort}/${effectiveDbName}` };
            const dbDriverMap = { postgresql: 'org.postgresql.Driver', mysql: 'com.mysql.cj.jdbc.Driver', mariadb: 'org.mariadb.jdbc.Driver', mssql: 'com.microsoft.sqlserver.jdbc.SQLServerDriver', oracle: 'oracle.jdbc.OracleDriver' };
            sharedSubItems.push(`  database:`);
            if (dbChoice !== 'postgresql') { sharedSubItems.push(`    allowNonPostgresql: true`); }
            sharedSubItems.push(`    type: ${dbChoice}`);
            sharedSubItems.push(`    driver: ${dbDriverMap[dbChoice]}`);
            sharedSubItems.push(`    url: ${dbUrlMap[dbChoice]}`);
            sharedSubItems.push(`    username: ${effectiveDbUser}`);
            sharedSubItems.push(`    password: ${effectiveDbPassword} # Based on password entered above`);
        }
        yamlLines.push(`# Recommended params based on ${tShirtSize} sizing`);
        sharedSubItems.push(`  extraJavaOpts: "${artifactoryExtraJavaOpts}"`);
        
        if (sharedSubItems.length > 0) {
            yamlLines.push(`shared:`);
            yamlLines = yamlLines.concat(sharedSubItems);
        }

        // --- Access Section ---
        yamlLines.push(`access:`);
        if (dbChoice) {
            yamlLines.push(`  database:`);
            yamlLines.push(`    maxOpenConnections: ${otherdbPool || 100} `);
        }
        yamlLines.push(`  javaOpts:`);
        yamlLines.push(`    extraJavaOpts: "${accessBaseJavaOpts}"`);
        yamlLines.push(`  tomcat:`);
        yamlLines.push(`    connector:`);
        yamlLines.push(`      maxThreads: ${accessMaxThreads || 100}`);

        // --- Artifactory Section ---
        yamlLines.push(`artifactory:`);
        if (dbChoice) {
            yamlLines.push(`  database:`);
            yamlLines.push(`    maxOpenConnections: ${artidbPool || 100} `);
        }
        // Artifactory JavaOpts are under shared.extraJavaOpts now
        yamlLines.push(`  tomcat:`);
        yamlLines.push(`    connector:`);
        yamlLines.push(`      maxThreads: ${artifactoryMaxThreads || 200}`);

        // --- Metadata Section ---
        yamlLines.push(`metadata:`);
        if (dbChoice) {
            yamlLines.push(`  database:`);
            yamlLines.push(`    maxOpenConnections: ${otherdbPool || 100}`);
        }

        return yamlLines.join('\n');
}
// ========================================================================
// Binarystore GENERATOR SECTION
// ========================================================================
function generateBinarystoreXmlSnippet(selections) {
    const {
        filestoreChoice, fsUseCache,
        fsCacheDir, fsMaxCacheSize, fsMaxFileSizeLimit, fsSkipDuringUpload, fsFileStoreDir,
        s3BucketName, s3Endpoint, s3PathPrefix, s3Region, s3AuthMethod, s3Identity, s3Credential,
        azureAccountName, azureAccountKey, azureContainerName, azureEndpoint,
        gcsBucketName, gcsPathPrefix, gcsUseInstanceCredentials
    } = selections;

    let userInputFilestoreChoice = filestoreChoice || 'file-system';
    let version = 'v1';

    let chainCommentTemplateName = userInputFilestoreChoice;
    let actualProviderId = userInputFilestoreChoice;

    if (userInputFilestoreChoice === 's3-storage-v3-direct') {
        actualProviderId = 's3-storage-v3';
        version = 'v2';
    } else if (userInputFilestoreChoice === 'azure-blob-storage-v2-direct') {
        actualProviderId = 'azure-blob-storage-v2';
        version = 'v2';
    } else if (userInputFilestoreChoice === 'google-storage-v2-direct') {
        actualProviderId = 'google-storage-v2';
        version = 'v2';
    } else if (userInputFilestoreChoice === 'cluster-file-system') {
        actualProviderId = 'cluster-file-system'; // Used for template name and general ID
        version = 'v2'; 
    }

    const isCluster = userInputFilestoreChoice === 'cluster-file-system';
    const isCloud = ['s3-storage-v3-direct', 'azure-blob-storage-v2-direct', 'google-storage-v2-direct'].includes(userInputFilestoreChoice);
    

    // Cluster is already v2. Cloud providers are already v2.
    if (fsUseCache && version === 'v1') {
        version = 'v2';
    }

    function generateProviderOptions(providerIdForOptions, currentSelections) {
        const options = [];
        const indent = '    ';
        const {
            fsFileStoreDir: selFsFileStoreDir,
            fsCacheDir: selFsCacheDir, fsMaxCacheSize: selFsMaxCacheSize, fsMaxFileSizeLimit: selFsMaxFileSizeLimit, fsSkipDuringUpload: selFsSkipDuringUpload,
            s3BucketName: selS3BucketName, s3Endpoint: selS3Endpoint, s3PathPrefix: selS3PathPrefix, s3Region: selS3Region, s3AuthMethod: selS3AuthMethod, s3Identity: selS3Identity, s3Credential: selS3Credential,
            azureAccountName: selAzureAccountName, azureAccountKey: selAzureAccountKey, azureContainerName: selAzureContainerName, azureEndpoint: selAzureEndpoint,
            gcsBucketName: selGcsBucketName, gcsPathPrefix: selGcsPathPrefix, gcsUseInstanceCredentials: selGcsUseInstanceCredentials
        } = currentSelections;

        switch (providerIdForOptions) {
            case 'file-system':
                if (selFsFileStoreDir) options.push(`${indent}<fileStoreDir>${selFsFileStoreDir}</fileStoreDir>`);
                break;
            case 'cluster-file-system':
                // Top-level options for cluster-file-system template itself.
                break;
            case 'state-aware': // Component of cluster-file-system
                if (selFsFileStoreDir) { // Only if a custom filestore dir is given
                    options.push(`${indent}<zone>local</zone>`);
                    options.push(`${indent}<fileStoreDir>${selFsFileStoreDir}</fileStoreDir>`);
                }
                break;
            case 'cache-fs':
                if (selFsCacheDir && selFsCacheDir !== 'cache') options.push(`${indent}<cacheProviderDir>${selFsCacheDir}</cacheProviderDir>`);
                if (selFsMaxCacheSize && selFsMaxCacheSize !== '5') options.push(`${indent}<maxCacheSize>${selFsMaxCacheSize}</maxCacheSize>`);
                if (selFsMaxFileSizeLimit) options.push(`${indent}<maxFileSizeLimit>${selFsMaxFileSizeLimit}</maxFileSizeLimit>`);
                if (selFsSkipDuringUpload) options.push(`${indent}<skipDuringUpload>true</skipDuringUpload>`);
                break;
            case 's3-storage-v3':
                
                if (selS3Endpoint) options.push(`${indent}<endpoint>${selS3Endpoint}</endpoint>`); 
                if (selS3Endpoint && !selS3Endpoint.endsWith('.amazonaws.com')) options.push(`${indent}<enablePathStyleAccess>true</enablePathStyleAccess>`);
                if (selS3BucketName) options.push(`${indent}<bucketName>${selS3BucketName}</bucketName>`);
                if (selS3PathPrefix) options.push(`${indent}<path>${selS3PathPrefix}</path>`);
                if (selS3Region) options.push(`${indent}<region>${selS3Region}</region>`);
                if (selS3AuthMethod === 'iam') {
                    options.push(`${indent}<useInstanceCredentials>true</useInstanceCredentials>`);
                } else if (selS3Identity && selS3Credential) {
                    options.push(`${indent}<identity>${selS3Identity}</identity>`);
                    options.push(`${indent}<credential>${selS3Credential}</credential>`);
                }
                break;
            case 'azure-blob-storage-v2':
                if (selAzureAccountName) options.push(`${indent}<accountName>${selAzureAccountName}</accountName>`);
                if (selAzureAccountKey) options.push(`${indent}<accountKey>${selAzureAccountKey}</accountKey>`);
                if (selAzureContainerName) options.push(`${indent}<containerName>${selAzureContainerName}</containerName>`);
                if (selAzureEndpoint) options.push(`${indent}<endpoint>${selAzureEndpoint}</endpoint>`);
                break;
            case 'google-storage-v2':
                if (selGcsBucketName) options.push(`${indent}<bucketName>${selGcsBucketName}</bucketName>`);
                if (selGcsPathPrefix) options.push(`${indent}<path>${selGcsPathPrefix}</path>`);
                if (typeof selGcsUseInstanceCredentials === 'boolean') {
                    options.push(`${indent}<useInstanceCredentials>${selGcsUseInstanceCredentials}</useInstanceCredentials>`);
                }
                break;
        }
        return options;
    }

    const chainLines = [];
    chainLines.push(`  <chain> `);

    if (isCluster) {
        if (fsUseCache) { // Cluster WITH optional cache
            chainLines.push(`    <provider id="cache-fs" type="cache-fs">`);
            chainLines.push(`        <provider id="sharding-cluster" type="sharding-cluster">`);
            chainLines.push(`            <sub-provider id="state-aware" type="state-aware"/>`);
            chainLines.push(`            <dynamic-provider id="remote-fs" type="remote"/>`);
            chainLines.push(`        </provider>`);
            chainLines.push(`    </provider>`);
        } else { // Cluster WITHOUT cache
            chainLines.push(`    <provider id="sharding-cluster" type="sharding-cluster">`);
            chainLines.push(`        <sub-provider id="state-aware" type="state-aware"/>`);
            chainLines.push(`        <dynamic-provider id="remote-fs" type="remote"/>`);
            chainLines.push(`    </provider>`);
        }
    } else if (fsUseCache) { // Non-cluster WITH cache
        chainLines.push(`    <provider id="cache-fs" type="cache-fs">`);
        chainLines.push(`      <provider id="${actualProviderId}" type="${actualProviderId}"/>`);
        chainLines.push(`    </provider>`);
    } else { // Non-cluster WITHOUT cache
        chainLines.push(`    <provider id="${actualProviderId}" type="${actualProviderId}"/>`);
    }
    chainLines.push(`  </chain>`);
    const chainXml = chainLines.join('\n');

    const providerDefinitions = [];

    if (isCluster) {
        // Only define cache-fs if it's effectively used with the cluster
        if (fsUseCache) {
            const cacheOptions = generateProviderOptions('cache-fs', selections);
            if (cacheOptions.length > 0) {
                providerDefinitions.push(`  <provider id="cache-fs" type="cache-fs">\n${cacheOptions.join('\n')}\n  </provider>`);
            }
        }
        // state-aware definition is independent of cache choice, depends on fsFileStoreDir
        const stateAwareOptions = generateProviderOptions('state-aware', selections);
        if (stateAwareOptions.length > 0) {
            providerDefinitions.push(`  <provider id="state-aware" type="state-aware">\n${stateAwareOptions.join('\n')}\n  </provider>`);
        }
    } else { // Logic for non-cluster types
        if (fsUseCache) {
            const cacheOptions = generateProviderOptions('cache-fs', selections);
            if (cacheOptions.length > 0) {
                providerDefinitions.push(`  <provider id="cache-fs" type="cache-fs">\n${cacheOptions.join('\n')}\n  </provider>`);
            }
        }
        const mainProviderOptions = generateProviderOptions(actualProviderId, selections);
        if (mainProviderOptions.length > 0) {
            providerDefinitions.push(`  <provider id="${actualProviderId}" type="${actualProviderId}">\n${mainProviderOptions.join('\n')}\n  </provider>`);
        }
    }

    let xml = `<config version="${version}">\n`;
    xml += `${chainXml}`;
    if (providerDefinitions.length > 0) {
        xml += `\n${providerDefinitions.join('\n')}`;
    }
    xml += `\n</config>`;
    return xml;
}


// ========================================================================
// INSTALLATION STEPS GENERATOR SECTION
// ========================================================================
function generateInstallationSteps(selections) {
    const { installType, installMode, userRange, dbChoice, filestoreChoice, tShirtSize, hostName } = selections;
    const allRequiredSelected = installType && installMode && userRange && dbChoice && filestoreChoice;

    if (!allRequiredSelected) {
        return '<p class="placeholder">Select options in all sections above to generate steps.</p>';
    }

    let stepsHtml = '';
    let downloadInfo = ''; 
    let installInfo = ''; 
    let jfrogHomeHostPath = ''; 
    let jfrogHomeInContainer = '/opt/jfrog/'; 
    let serviceCommand = '';
    let osPrepNotes = '';
    let startCommand = '';
    let statusCommand = '';
    let stopCommand = ''; 
    let enableCommand = '';
    let logFile = '';
    let stepCounter = 0;
    let  displayFileStoreDir = '';

    // ============ PREREQUISITES SECTION ==================================================================//
    
    stepsHtml += `<div class="info-box"><h3>Prerequisites</h3>`;
    stepsHtml += `<p>Throughout these instructions, <code>$JFROG_HOME</code> refers to a directory path.</p>`;

    switch (installType) {
        case 'rpm':
        case 'debian':
            jfrogHomeHostPath = '/opt/jfrog';
            stepsHtml += `<p>For <strong style="text-transform: capitalize;">${installType}</strong>, <code>$JFROG_HOME</code> is fixed at: <code>${jfrogHomeHostPath}</code>. This is where Artifactory is installed and stores its data by default.</p>`;
            stepsHtml += `<p>To make this variable available in your terminal run:`;
            stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>export JFROG_HOME=${jfrogHomeHostPath}</code></pre>`;
            serviceCommand = 'systemctl';
            logFile = `$JFROG_HOME/artifactory/var/log/console.log`;
            break;
        case 'linux':
            jfrogHomeHostPath = '<code>&lt;extracted_directory&gt;/artifactory-pro-&lt;version&gt;</code>';
            stepsHtml += `<p>For <strong>Linux Archive</strong>, <code>$JFROG_HOME</code> can be any location of your choosing, it is the where you will extract the downloaded installer into (e.g., /opt/jfrog.</p>`;
            stepsHtml += `<p>To make this variable available in your terminal, Create a directory (e.g <code>/opt/jfrog</code>)  <code>cd</code> into it and run:`;
            stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>export JFROG_HOME=$(pwd)</code></pre>`;
            serviceCommand = `$JFROG_HOME/app/bin/artifactory.sh`;
            logFile = `$JFROG_HOME/artifactory/var/log/console.log`;
            break;
        case 'docker':
            jfrogHomeHostPath = '<code>&lt;your_chosen_host_directory&gt;</code>';
            stepsHtml += `<p>For <strong>Docker</strong>, <code>$JFROG_HOME</code> is a directory you create on your <strong>host machine</strong>. This directory will be volume-mounted into the Artifactory container to persist data.</p>`;
            stepsHtml += `<p>To make this variable available in your terminal, <code>cd</code> into your chosen directory and run:`;
            stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>export JFROG_HOME=$(pwd)</code></pre>`;
            serviceCommand = 'docker';
            // Log file and other commands will be Docker-specific, set later.
            break;
        case 'docker-compose':
            jfrogHomeHostPath = '<code>~/.jfrog</code> (default)';
            stepsHtml += `<p>For <strong>Docker Compose</strong>, <code>$JFROG_HOME</code> on the <strong>host machine</strong> (where data is persisted) is defined in the <code>.env</code> file within the extracted compose package. It defaults to <code>~/.jfrog</code> but can be customized there.</p>`;
            stepsHtml += `<p>Inside the Artifactory container, <code>$JFROG_HOME</code> is <code>${jfrogHomeInContainer}</code>.</p>`;
            serviceCommand = 'docker-compose';
            // Log file and other commands will be Compose-specific, set later.
            break;
    }
    stepsHtml += ``;
    
    // ================ DATABASE SECTION ===================//
    if (dbChoice ) {
        stepsHtml += `<hr><h5 style="text-transform: capitalize;">External Database Preparation (${dbChoice})</h5>`;
        
        stepsHtml += `<p>Before installing Artifactory, ensure your external <strong style="text-transform: capitalize;">${dbChoice}</strong> database is set up:</p>
                        <ul>
                        <li>Please ensure you followed the DB setup box in Step 4 Above.</li>
                        <li>Ensure network connectivity from the machine(s) where Artifactory will run to your database server <code>${selections.dbHost}:${selections.dbPort}</code></li>`;
                        if(dbDetails[dbChoice].driver !== ``){stepsHtml += `<li>This DB needs an external driver, this will be added in a later step.</li>`;}
        stepsHtml += `</ul>`;
    }
        if (installMode === 'highAvailability') {
        stepsHtml += `<hr><h5>High Availability Prerequisites:</h5>
        <ul>
            <li>An Enterprise license is required for each node you plan to implement. <br><small>Please speak to sales@jfrog.com for help with acquiring licenses</small>.</li>`;
            if (filestoreChoice === 'file-system') {displayFileStoreDir = selections.fsFileStoreDir ? selections.fsFileStoreDir : '$JFROG_HOME/artifactory/var/data/artifactory/filestore'
                stepsHtml += `<li>When using the file-system filestore in HA mode, your filestore directory (<code>${displayFileStoreDir}</code>) must be shared by all nodes by mounting <strong>the same external storage (e.g NFS) to each node</strong>.</li>`};
                
        stepsHtml += `</ul>`;
    }

    // ============== PORT SECTION =======================//
    let portInfoHtml = '<hr><h4>Network Port Information</h4>';
    portInfoHtml += '<p>Artifactory requires 2 external ports to be accessible by default (these ports can be configured). Please ensure these are not blocked by firewalls.</p>';
    portInfoHtml += '<ul>';
    portInfoHtml += '<li><strong>8081:</strong>Direct to Artifactory Microservice.</li>';
    portInfoHtml += '<li><strong>8082:</strong> Router service (Primary entry point for all activity).</li>';
    portInfoHtml += '</ul>';
    portInfoHtml += '<p>Artifactory also uses a range of internal ports that must be free for the application to start, for a complete overview please refer to the official documentation: <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-network-ports" target="_blank">Artifactory Network Ports</a>.</p>';

    stepsHtml += portInfoHtml;

    stepsHtml += `</div>`; // End Prerequisites Step

    // ============ Download Steps ===================
    stepCounter = 0;
    if (installType === 'docker') {
        
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Prepare Host Environment & Initial Configuration</h4>`;
        stepsHtml += `<p>Using the <code>$JFROG_HOME</code> path you defined on your host (see Prerequisites):</p>
                        <pre><button class="copy-button" title="Copy command">Copy</button><code>mkdir -p $JFROG_HOME/artifactory/var/etc/artifactory\ntouch $JFROG_HOME/artifactory/var/etc/system.yaml\ntouch $JFROG_HOME/artifactory/var/etc/artifactory/binarystore.xml</code></pre>
                        <p>Set ownership (Artifactory container runs as UID 1030 by default):</p>
                        <pre><button class="copy-button" title="Copy command">Copy</button><code>sudo chown -R 1030:1030 $JFROG_HOME/artifactory/var</code></pre>
                        <p>If using Docker on macOS, you might also need:</p>
                        <pre><button class="copy-button" title="Copy command">Copy</button><code>sudo chmod -R 777 $JFROG_HOME/artifactory/var</code></pre></div>`;

    }  else {
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Download Artifactory</h4>`;
        switch (installType) {
            case 'debian':
                console.log(artifactoryVersion);
                if (artifactoryVersion !== '&lt;version&gt;') {
                    downloadInfo = `<p>Run the following command to download the latest Debian Artifactory version ${artifactoryVersion}:</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro-debs/pool/jfrog-artifactory-pro/jfrog-artifactory-pro-${artifactoryVersion}.deb'</code></pre>`;
                } else {
                    downloadInfo = `<p>Run the following command to download the latest Artifactory Pro DEB package:</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro-debs/pool/jfrog-artifactory-pro/jfrog-artifactory-pro-[RELEASE].deb'</code></pre>`;
                }
                downloadInfo += `<p>If you need a different version, please visit the <a href="https://jfrog.com/download-legacy/" target="_blank">JFrog Platform Downloads page</a> to see previous versions and insert the required version number into the command.</p>`;
                break;
            case 'rpm':
                if (artifactoryVersion !== '&lt;version&gt;') {
                    downloadInfo = `<p>Run the following command to download the latest RPM Artifactory version ${artifactoryVersion}:</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro-rpms/jfrog-artifactory-pro/jfrog-artifactory-pro-${artifactoryVersion}.rpm'</code></pre>`;
                } else {
                    downloadInfo = `<p>Run the following command to download the latest Artifactory Pro RPM package:</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro-rpms/jfrog-artifactory-pro/jfrog-artifactory-pro-[RELEASE].rpm'</code></pre>`;
                }

                downloadInfo += `<p>If you need a different version, please visit the <a href="https://jfrog.com/download-legacy/" target="_blank">JFrog Platform Downloads page</a> to see previous versions and insert the required version number into the command.</p>`;
                break;
            case 'linux':
                    if (artifactoryVersion !== '&lt;version&gt;') {
                    downloadInfo = `<p>Run the following command to download the latest Linux Archive Artifactory version ${artifactoryVersion}:</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/${artifactoryVersion}/jfrog-artifactory-pro-${artifactoryVersion}-linux.tar.gz'</code></pre>`;
                } else {
                    downloadInfo = `<p>Run the following command to download the latest Artifactory Pro Linux Archive (<code>.tar.gz</code>):</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/[RELEASE]/jfrog-artifactory-pro-[RELEASE]-linux.tar.gz'</code></pre>`;
                }
                downloadInfo += `<p>If you need a different version, please visit the <a href="https://jfrog.com/download-legacy/" target="_blank">JFrog Platform Downloads page</a> to see previous versions and insert the required version number into the command.</p>`;
                break;
            case 'docker-compose':
                if (artifactoryVersion !== '&lt;version&gt;') {
                    downloadInfo = `<p>Run the following command to download the latest Docker Compose package for Artifactory,  ${artifactoryVersion}</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget 'https://releases.jfrog.io/artifactory/artifactory-pro/org/artifactory/pro/docker/jfrog-artifactory-pro/${artifactoryVersion}/jfrog-artifactory-pro-${artifactoryVersion}-compose.tar.gz'</code></pre>`;                    } else {
                    downloadInfo = `<p>Run the following command to download the latest Artifactory Pro Docker Compose package (<code>.tar.gz</code>):</p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>wget'https://releases.jfrog.io/artifactory/artifactory-pro/org/artifactory/pro/docker/jfrog-artifactory-pro/[RELEASE]/jfrog-artifactory-pro-[RELEASE]-compose.tar.gz'</code></pre>`;                    }
                downloadInfo += `<p>If you need a different version, please visit the <a href="https://jfrog.com/download-legacy/" target="_blank">JFrog Platform Downloads page</a> to see previous versions and insert the required version number into the command.</p>`;
                break;
        }     
    
        stepsHtml += downloadInfo + `</div>`;
    
        // ============ Install Steps ===================
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Install Artifactory ${installMode === 'highAvailability' ? 'Primary Node' : ''}</h4>`;
    
        if (installType === 'debian') {
            stepsHtml += `<p><strong>Note:</strong> If <code>net-tools</code> is not installed, run:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>sudo apt-get update && sudo apt-get install net-tools</code></pre>`;
        }
    
        switch (installType) {
            case 'debian':
                installInfo = `<p>As a root user, run:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>dpkg -i jfrog-artifactory-pro-${artifactoryVersion}.deb</code></pre>
                            <p>If different, replace <code>${artifactoryVersion}</code> with the downloaded version number.</p>`;
                startCommand = `sudo ${serviceCommand} start artifactory.service`;
                statusCommand = `sudo ${serviceCommand} status artifactory.service`;
                stopCommand = `sudo ${serviceCommand} stop artifactory.service`;
                break;
            case 'rpm':
                installInfo = `<p>As a root user, run:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>sudo yum install -y jfrog-artifactory-pro-${artifactoryVersion}.rpm</code></pre>
                            <p>If different, replace <code>${artifactoryVersion}</code> with the downloaded version number.</p>`;
                startCommand = `sudo ${serviceCommand} start artifactory.service`;
                statusCommand = `sudo ${serviceCommand} status artifactory.service`;
                stopCommand = `sudo ${serviceCommand} stop artifactory.service`;
                break;
            case 'linux':
                installInfo = `<p>Move the downloaded installer archive into your $JFROG_HOME directory.</p>
                <pre><button class="copy-button" title="Copy command">Copy</button><code>mv jfrog-artifactory-pro-${artifactoryVersion}-linux.tar.gz $JFROG_HOME</code></pre>
                <p>Extract the downloaded archive:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>tar -xzvf jfrog-artifactory-pro-${artifactoryVersion}.tar.gz</code></pre>
                            <p>If different, replace <code>${artifactoryVersion}</code> with the downloaded version number.</p>
                            <p>Navigate into the extracted directory (your <code>$JFROG_HOME</code>).</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>cd $JFROG_HOME</code></pre>
                            <p>Rename the extracted folder from artifactory-pro-<version> to artifactory, For example:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>mv artifactory-pro-7.104.10 artifactory</code></pre>`;
                startCommand = `$JFROG_HOME/artifactory/app/bin/artifactoryctl start`; 
                statusCommand = `$JFROG_HOME/artifactory/app/bin/artifactoryctl check`;
                stopCommand = `$JFROG_HOME/artifactory/app/bin/artifactoryctl stop`;
                break;
            case 'docker-compose':
                installInfo = `<p>Extract the downloaded archive:</p>
                                <pre><button class="copy-button" title="Copy command">Copy</button><code>tar -xvf jfrog-artifactory-pro-${artifactoryVersion}-compose.tar.gz</code></pre>
                                <p>If different, replace <code>${artifactoryVersion}</code> with the downloaded version number</p>
                                <p>Navigate into the extracted directory (e.g., <code>cd jfrog-artifactory-pro-${artifactoryVersion}</code>).</p>
                                <p>Run the interactive setup script:</p>
                                <pre><button class="copy-button" title="Copy command">Copy</button><code>./config.sh</code></pre>
                                <p>This script will help you set up required folders, ownership, and generate a <code>docker-compose.yaml</code> and <code>.env</code> file.
                                During the process, it will ask if you want to install Postgres. We recommend using an external Postgres for production (so select no); the internal Postgres is suitable for testing. Review the <code>.env</code> file for <code>JFROG_HOME</code> (default: <code>~/.jfrog</code>) and other settings. The <code>docker-compose.yaml</code> will define services including Artifactory and potentially a database.</p> </div>`;
                startCommand = `docker compose -p rt up -d`;
                statusCommand = `docker compose -p rt ps`;
                stopCommand = `docker compose -p rt down`;
                logFile = `docker compose -p rt logs`;
                break;
        }
        stepsHtml += installInfo + `</div>`;
    }//Back to steps for all install types

    // ============ DB Driver Steps ===================
    if(dbDetails[dbChoice].driver !== ``){
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Add DB Driver</h4>
                <p>`;
        switch (dbChoice) {
            case 'mysql':
                driverInfo = `The MySQL JDBC driver is required to connect to the DB. Download the platform independent MySQL JDBC driver (available from the <a href="https://dev.mysql.com/downloads/connector/j/" target="_blank"> MySQL website)</a> and copy the <code>mysql-connector-java-<version>.jar</code> file into <code>$JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib</code> directory. Make sure your driver has the same permissions and owner as the rest of the files in the <code>$JFROG_HOME/artifactory/var</code> directory. </p>
                <p>For example: <pre><button class="copy-button" title="Copy Config">Copy</button><code>curl --create-dirs https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.33/mysql-connector-java-8.0.33.jar -o $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mysql-connector-java-8.0.33.jar</code></pre><pre><button class="copy-button" title="Copy Config">Copy</button><code>chmod 644 $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mysql-connector-java-8.0.33.jar</code></pre><pre><button class="copy-button" title="Copy Config">Copy</button><code>chown ${selections.installType === 'docker' ? '1030:1030' : 'artifactory:artifactory'} $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mysql-connector-java-8.0.33.jar</code></pre></p>`;
                break;
            case 'mariadb':
                driverInfo = `The MariaDB JDBC driver is required to connect to the DB. Download the platform independent MariaDB JDBC driver (available from the<a href="https://mariadb.org/download/" target="_blank"> MariaDB website)</a> and copy the <code>mariadb-java-client-<version>.jar</code> file into <code>$JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib</code> directory. Make sure your driver has the same permissions and owner as the rest of the files in the <code>$JFROG_HOME/artifactory/var</code> directory. </p>
                <p>For example: <pre><button class="copy-button" title="Copy Config">Copy</button><code>curl --create-dirs https://dlm.mariadb.com/4234102/Connectors/java/connector-java-3.5.3/mariadb-java-client-3.5.3.jar -o $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mariadb-java-client-3.5.3.jar</code></pre><pre><button class="copy-button" title="Copy Config">Copy</button><code>chmod 644 $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mariadb-java-client-3.5.3.jar</code></pre><pre><button class="copy-button" title="Copy Config">Copy</button><code>chown ${selections.installType === 'docker' ? '1030:1030' : 'artifactory:artifactory'} $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mariadb-java-client-3.5.3.jar</code></pre></p>`;
                break;
            case 'mssql':
                driverInfo = `<p>The Microsoft JDBC Driver for SQL Server is required to connect to the DB. You can download the and extract the Microsoft JDBC Driver and copy the sqljdbcjar file directly from <a href="https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-ver15#download" target="_blank">Microsoft</a> and copy the <code>mssql-jdbc-12.10.0.jre11.jar</code> file into the <code>$JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib</code> directory. Ensure this JAR file has the same permissions and owner as the rest of the files in the <code>$JFROG_HOME/artifactory/var</code> directory.</p>
                <p>For example:
                <pre><button class="copy-button" title="Copy Config">Copy</button><code>curl --create-dirs -L https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/12.10.0.jre11/mssql-jdbc-12.10.0.jre11.jar -o $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mssql-jdbc-12.10.0.jre11.jar</code></pre>
                <pre><button class="copy-button" title="Copy Config">Copy</button><code>chmod 644 $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mssql-jdbc-12.10.0.jre11.jar</code></pre>
                <pre><button class="copy-button" title="Copy Config">Copy</button><code>chown ${selections.installType === 'docker' ? '1030:1030' : 'artifactory:artifactory'} $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib/mssql-jdbc-12.10.0.jre11.jar</code></pre>
                </p>`;
                break;
            case 'oracle':
                driverInfo = `<ol><li>Download and install the <a href="https://pkgs.org/download/libaio" target="_blank"><code>libaio</code></a> library.</p>
                <p>For Example: <code>${selections.installType === 'debian' ? 'sudo apt install libaio1t64' : selections.installType === 'rpm' ? 'yum install libaio' : 'On Ubuntu 24.04: sudo apt install libaio1t64 On Redhat: yum install libaio'}</code> </li> 
                
                <li>Copy the libaio directory to the Artifactory Tomcat lib directory, $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib.<br>Create the Tomcat lib directory if it doesn't exist.<br> The libaio directory name varies between environments. The following example shows a RHEL environment.
                <pre><button class="copy-button" title="Copy YAML">Copy</button><code>cp -rp /usr/lib64/libaio.so.1 $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib</code></pre></li>

                <li>Download the <a href="https://www.oracle.com/database/technologies/instant-client/downloads.html" target="_blank">Oracle Instant Client </a>  lib for the environment in which your Artifactory runs, (arm/x86).</li> 

                <li>Extract the Oracle Instant Client and copy the OJDBC jar file to the $JFROG_HOME/artifactory/var/bootstrap/artifactory/tomcat/lib directory. The name of the OJDBC jar files varies between environments. In RHEL 8, the the OJDBC jar file <code>ojdbc8.jar</code>.<br>Ensure this JAR file has the same permissions and owner as the rest of the files in the <code>$JFROG_HOME/artifactory/var</code> directory.</li>
                
                <li>Set the LD_LIBRARY_PATH, in the Artifactory System YAML file below, to point to the extracted Oracle Instant Client directory.
                <pre><button class="copy-button" title="Copy YAML">Copy</button><code>shared:\n  env:\n    LD_LIBRARY_PATH: Oracle Instant Client directory path </code></pre>
                
                For example
                <pre><button class="copy-button" title="Copy YAML">Copy</button><code>shared:\n  env:\n    LD_LIBRARY_PATH: /opt/jfrog/artifactory/var/bootstrap/artifactory/tomcat/lib:/opt/jfrog/artifactory/var/bootstrap/artifactory/instant_client </code></pre>
                    
                </li></ol>
                    `;
                    break;
        }
        stepsHtml += driverInfo;
        stepsHtml += `</p> </div>`;
    }
    
    // ============ System.yaml Steps ===================
    stepsHtml += `<div class="step"><h4>${++stepCounter}. Configure Artifactory (system.yaml)</h4>
                    <p>Edit the main configuration file: <code>$JFROG_HOME/artifactory/var/etc/system.yaml</code></p>
                    <p>Apply the following configuration. <b>Please preserve the spacing, this is vital for a yaml file to work as intended.</b> ${installMode === 'highAvailability' ? 'Ensure these configurations are <strong>identical</strong> on all HA nodes.' : ''}</p>`;
    if(installType === 'docker-compose'){
        stepsHtml += `<p>The ./config script will generate a system.yaml file for you, including the autodetected shared.node.ip and Postgres details if you chose that option. <strong>Preserve the database url and password in this pregenerated yaml.</strong>  </p>`;
    }
    if ((installType === 'docker' || installType === 'docker-compose') && hostName === '' ) {
        stepsHtml += `<p class="warning"> Please fill in shared.node.ip by inserting the hostname or IP of your host machine in step 1</p>`;
    }
                    const systemYamlSnippet = generateSystemYamlSnippet(selections);
    stepsHtml += `<pre><button class="copy-button" title="Copy YAML">Copy</button><code>${systemYamlSnippet}</code></pre>`;


    stepsHtml += `<p>The snippet includes recommended JVM memory settings and tuning parameters. Refer to the <a href="https://jfrog.com/help/r/how-do-i-tune-artifactory-for-heavy-loads/how-do-i-tune-artifactory-for-heavy-loads" target="_blank">tuning documentation</a>.</p>
    <p>There are many other options available to change in the system.yaml Full reference: <a href="https://jfrog.com/help/r/jfrog-installation-setup-documentation/artifactory-system-yaml-configuration-topics" target="_blank">Artifactory Yaml.</a> </p></div>`;

    // ============ Binarystore.xml Steps ===================
    stepsHtml += `<div class="step"><h4>${++stepCounter}. Configure Filestore (${filestoreChoice})</h4>
                    <p>Edit the binarystore.xml configuration file: <code>$JFROG_HOME/artifactory/var/etc/artifactory/binarystore.xml</code></p>`;
    const binarystoreXmlSnippet = generateBinarystoreXmlSnippet(selections);
    stepsHtml += `<p>Apply the following configuration ${installMode === 'highAvailability' ? 'Ensure this file is <strong>identical</strong> on all HA nodes.' : ''}</p>
                    <pre><button class="copy-button" title="Copy XML">Copy</button><code>${binarystoreXmlSnippet.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    
                    
    stepsHtml += `</div>`;

    // ============ Start Arti Steps ===================
    if (installType === 'docker'){
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Start Artifactory Container</h4>`;
        startCommand = `docker run --name artifactory -v $JFROG_HOME/artifactory/var/:${jfrogHomeInContainer}/artifactory/var -d -p 8081:8081 -p 8082:8082 releases-docker.jfrog.io/jfrog/artifactory-pro:${artifactoryVersion}`;
        if(artifactoryVersion !== '&lt;version&gt;') {
            stepsHtml += `<p>Run the container:`; 
        }else{
            stepsHtml += `<p>Run the container (replace <code>${artifactoryVersion}</code> with the version you want to run):</p>`;
        }
        stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>${startCommand}</code></pre>
                        <p>To find a different version, please visit the <a href="https://jfrog.com/download-legacy/" target="_blank">JFrog Platform Downloads page</a> to see previous versions and insert the required version number into the command.</p>
                    
                    <p>To start a previously stopped container: <code>docker start artifactory</code></p></div>`;

    statusCommand = `docker ps -f name=artifactory`;
    stopCommand = `docker stop artifactory`;
    logFile = `docker logs -f artifactory`;

    }else{
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Start Artifactory ${installMode === 'highAvailability' ? 'Primary Node' : ''}</h4>`;
    
        if (installType === 'linux' ) {
            stepsHtml += `<p>By Default you can run Artifactory as a process, it can be a foreground or as daemon (background) process. When running as a foreground process, the console is locked and you can stop the process at any time.</p>
                        <p>To run as a foreground process (Not Recommended): <pre><button class="copy-button" title="Copy command">Copy</button><code>$JFROG_HOME/artifactory/app/bin/artifactoryctl</code></pre></p>
                        <p>To run as a daemon process:<pre><button class="copy-button" title="Copy command">Copy</button><code>${startCommand}</code></pre>`;
        }else if(installType === 'docker-compose' ) {
            if (dbChoice === 'postgresql') {
                stepsHtml += `<p>If you chose to install Postgres locally, you must start your Postgres container first:</p>
                            <pre><button class="copy-button" title="Copy command">Copy</button><code>docker compose -p rt-postgres -f docker-compose-postgres.yaml up -d</code></pre>
                            <p> Otherwise run Artifactory with:</p>`;
            }
            stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>${startCommand}</code></pre>
            <p class="warning"><strong>Note:</strong> This command must be run from inside your extracted directory where the <code>docker-compose.yaml</code> is located.</p>`;
            stepsHtml += `<p><span class="recommendation">Tip:</span> There are some additional docker-compose templates in the templates directory. These templates combine Postgres, Artifactory and even Nginx into one docker-compose.yaml. You can choose any template and copy it to the extracted folder as <code>docker-compose.yaml</code> to simplify the control of the containers, allowing a single command to bring up and down all the containers.</p>`;

        }else{
            stepsHtml += `<pre><button class="copy-button" title="Copy command">Copy</button><code>${startCommand}</code></pre>`;
        }
    stepsHtml += `</div>`;
    }
    

    // === COMMON FINAL STEPS ===
    // (Manage, Check Logs, Access UI, HA Secondary, Post-Install)
    // Adjust step numbers based on the installType path taken

    stepsHtml += `<div class="step"><h4>${++stepCounter}. Manage & Monitor</h4>`;
    
    if (logFile.startsWith('$JFROG_HOME') || installType === 'linux' || installType === 'rpm' || installType === 'debian') {
            stepsHtml += `<p>Monitor the startup process and ongoing activity in the console log:</p>
                        <pre><button class="copy-button" title="Copy command">Copy</button><code>tail -f ${logFile}</code></pre>
                        <p class="warning"><strong>Note: </strong>The console.log prints the output of all the microservice service logs, this can be overwhelming.<br>It can be easier to check just the artifactory-service.log . <br>If you see no errors, check the router-service.log for the message 'All services started successfully'.`;
    } else if (logFile) { // Docker, Docker Compose
        stepsHtml += `<p>Monitor the startup process and ongoing activity using:</p>
                        <pre><button class="copy-button" title="Copy command">Copy</button><code>${logFile}</code></pre>`;
    }
    if (statusCommand) {
        stepsHtml += `<p>To check status: <pre><button class="copy-button" title="Copy command">Copy</button><code>${statusCommand}</code></pre></p>`;
    }
    if (stopCommand) {
        stepsHtml += `<p>To stop Artifactory: <pre><button class="copy-button" title="Copy command">Copy</button><code>${stopCommand}</code></pre></p>`;
    }
    if (installType === 'linux' ) {
        stepsHtml += `</div>`;
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Configure Artifactory to run as a service (Recommended)</h4>`;
        stepsHtml += `<p>It is recommended to enable Artifactory to start on boot and run as a service.</p>
                                    <p>Artifactory is packaged as an archive file with a bundled Tomcat, and a complete install script that you can use to install it as a service running under a custom user. This is currently supported on Linux and Solaris systems.</p>
                                    <p>When running Artifactory as a service, the installation script creates a user called <code>artifactory</code>, which must have run and execute permissions on the installation directory. We recommended that you extract the Artifactory download file into a directory that gives run and execute permissions to all users such as <code>/opt</code></p>
                                    
                                    <p>To install Artifactory as a service, browse to the <code>$JFROG_HOME/artifactory/app/bin</code> directory and run <code>installService.sh</code> </p>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>cd $JFROG_HOME/artifactory/app/bin \n./installService.sh</code></pre>
                                    <p> The following optional parameters are available with <code>installService.sh</code>:</p>
                                    <ul>
                                    <li><code>USER</code> - The user that you want to run the application as. The default value is <code>artifactory</code> </li>
                                    <li><code>GROUP</code> - The group with which the application will run as. The default value is <code>artifactory</code></li>
                                    </ul>
                                    <p><code>$JFROG_HOME/artifactory/app/bin/installService.sh [USER] [GROUP] </code></p>

                                    <p>Once you have installed Artifactory as a service it can be managed depending on your system.</p>
                                    <p><b>Using systemd</b></p>
                                    <p><pre><button class="copy-button" title="Copy command">Copy</button><code>systemctl artifactory.service start</code></pre>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>systemctl artifactory.service stop</code></pre>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>systemctl artifactory.service status</code></pre></p>



                                <p><b>Using init.d</b></p>
                                    <p><pre><button class="copy-button" title="Copy command">Copy</button><code>service artifactory start</code></pre>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>service artifactory stop</code></pre>
                                    <pre><button class="copy-button" title="Copy command">Copy</button><code>service artifactory check</code></pre></p>
                                    `;
    }
    stepsHtml += `</div>`;

    stepsHtml += `<div class="step"><h4>${++stepCounter}. Access UI</h4>`;
    stepsHtml += `<p>Once started, access Artifactory in your browser. <a href="http://<SERVER_HOSTNAME>:8082/ui/" target="_blank">http://&lt;SERVER_HOSTNAME&gt;:8082/</a> (Replace <code>&lt;SERVER_HOSTNAME&gt;</code> with your server's actual IP/hostname).</p>
                    On first access:
                    <ol>
                    <li>You will be prompted to set up the administrator password.</li>
                    <li>Configure a <a href="https://jfrog.com/help/r/jfrog-platform-administration-documentation/general-system-settings#GeneralSystemSettings-ConfiguringaBaseURL" target="_blank">Base URL</a>.</li>
                    <li>Insert your Artifactory license ${installMode === 'highAvailability' ? 'key' : 'Keys'}.</li>
                    <li>Configure repositories.</li>
                    </ol>
                </div>`;

    if (installMode === 'highAvailability') {
        stepsHtml += `<div class="step"><h4>${++stepCounter}. Setup Additional HA Nodes</h4>
                        <ol>
                            <li>You can now set up additional nodes. On a separate machine, repeat the steps from the instructions above until the instruction to start the node.
                            <p class="warning">Do not start Artifactory on the additional node yet!</p></li>
                            <li>Before starting Artifactory on secondary nodes:
                                <ul>`;
                                if (filestoreChoice === 'file-system'){ stepsHtml += `<li>Ensure the shared storage for <code>$JFROG_HOME/artifactory/var/data/artifactory/filestore</code>) is mounted correctly and accessible.</li>`;}
                                stepsHtml += `  
                                    <li>Copy the master key (<code>$JFROG_HOME/artifactory/var/etc/security/master.key</code>) from the primary node to all secondary nodes. If it doesn't exist on the primary yet, start the primary node once to generate it please also access the UI and insert your licenses, and then proceed.</li>  
                                    <li>Ensure you have inserted the <code>$JFROG_HOME/artifactory/var/etc/system.yaml</code> to the exact same location on the secondary node.</li>
                                    <li>Ensure you have inserted the <code>$JFROG_HOME/artifactory/var/etc/artifactory/binarystore.xml</code> to the exact same location to the secondary node.</li>
                                    
                                </ul>
                            </li>
                            <li>Start Artifactory on the secondary nodes using the same command as in Step 5 (Start Artifactory) for ${installType}.</li>
                            <li>The nodes will detect each other as they connect to the same DB.</li>
                            <li>Repeat this as many times as you want for additional nodes. Each node will need its own license to run.</li>
                            <li><strong>For HA</strong> it is required to set up a loadbalancer/reverse proxy to provide a single access point for all nodes.</li>
                        </ol>
                        </div>`;
    }
    stepsHtml += `<div class="step"><h4>${++stepCounter}. Post Installation Steps </h4>
                <ol>
                    <li>${installMode === 'highAvailability' ? '<strong> Required: </strong>' : ''} Configure a <a href="https://jfrog.com/help/r/jfrog-artifactory-documentation/http-settings" target="_blank">Reverse Proxy</a>. This allows the set up of TLS access to Artifactory, loadbalancing and many other benefits.</li>
                    <li>Review and configure <a href="https://jfrog.com/help/r/jfrog-platform-administration-documentation/general-security-settings" target="_blank">security settings</a> (e.g., password policies, API key settings).</li>
                    <li>Set up robust <a href="https://jfrog.com/help/r/jfrog-platform-administration-documentation/backing-up-the-platform" target="_blank">backups</a> for your database and filestore.</li>
                </ol>
                    </div>`;

    stepsHtml += `<hr>
                    <p><strong>Important Note on Tuning:</strong> The provided configuration snippets are starting points. For production, <strong>monitor your system's performance</strong> (CPU, memory, GC, DB load) and <strong>tune parameters accordingly</strong>.</p>`;

    if (typeof debugLog === 'function') {
        debugLog("Generated steps HTML successfully.");
    }
    return stepsHtml;
}

// Combined update function
function updateAll() {
    debugLog("updateAll called. Current selections:", JSON.parse(JSON.stringify(selections)));
        updateOsInfoContent();
        updateSizingInfo();
        updateDbDetails();
        updateFilestoreDetails();
        shadowRoot.querySelectorAll('.ha-only').forEach(opt => {
        opt.classList.toggle('hidden', selections.installMode !== 'highAvailability');
        });

        const steps = generateInstallationSteps(selections);
        installStepsContent.innerHTML = steps;
        installStepsSection.classList.remove('hidden');

        installStepsContent.querySelectorAll('.copy-button').forEach(button => {
        button.onclick = handleCopyClick;
        });
        dbPrereqsContainer.querySelectorAll('.copy-button').forEach(button => {
            button.onclick = handleCopyClick;
        });
}

// Handles clicks on all copy buttons
function handleCopyClick(event) {
        const button = event.target;
        const pre = button.closest('pre');
        const codeElement = pre?.querySelector('code');
        if (codeElement) {
            const textToCopy = codeElement.innerText; // Use innerText to avoid copying HTML entities
            navigator.clipboard.writeText(textToCopy)
                .then(() => { button.textContent = 'Copied!'; button.style.backgroundColor = '#28a745'; setTimeout(() => { button.textContent = 'Copy'; button.style.backgroundColor = '#6c757d'; }, 1500); })
                .catch(err => { debugLog('Error: Failed to copy text: ', err); button.textContent = 'Error'; button.style.backgroundColor = '#dc3545'; setTimeout(() => { button.textContent = 'Copy'; button.style.backgroundColor = '#6c757d'; }, 2000); });
        }
}

// --- Event Listeners ---
installSelect.addEventListener('change', (e) => { selections.installType = e.target.value; updateAll(); });
hostName.addEventListener('input', (e) => { selections.hostName = e.target.value; updateAll(); });


installModeSelect.addEventListener('change', (e) => {
        const previousMode = selections.installMode;
        const newMode = e.target.value;
        selections.installMode = newMode; 
        const currentFilestore = selections.filestoreChoice;

        // Scenario 1: Switching FROM High Availability TO Single Node
        if (previousMode === 'highAvailability' && newMode === 'singleNode' && currentFilestore === 'cluster-file-system' ) {
            filestoreSelect.value = "file-system";            
            selections.filestoreChoice = 'file-system';    

        }
        // Scenario 2: Switching TO High Availability mode
        else if (newMode === 'highAvailability' && currentFilestore === 'file-system') {
            filestoreSelect.value = 'cluster-file-system';
            selections.filestoreChoice = 'cluster-file-system';
        }
        updateAll(); 
});
userRangeSelect.addEventListener('change', (e) => { selections.userRange = e.target.value; updateAll(); });
dbSelect.addEventListener('change', (e) => {
    selections.dbChoice = e.target.value;
    const dbType = selections.dbChoice;
    let defaultPort = '';
    let defaultDbName = '';
    if (dbType) {
        switch (dbType) {
            case 'postgresql':
                defaultPort = '5432';
                defaultDbName = 'artifactory';
                break;
            case 'mysql':
                defaultPort = '3306';
                defaultDbName = 'artdb';
                break;
            case 'mariadb':
                defaultPort = '3306';
                defaultDbName = 'artdb';
                break;
            case 'mssql':
                defaultPort = '1433';
                defaultDbName = 'artifactory';
                break;
            case 'oracle':
                defaultPort = '1521';
                defaultDbName = 'artifactory';
                break;
        }
        selections.dbName = defaultDbName;
        dbNameInput.value = defaultDbName;
        selections.dbPort = defaultPort;
        dbPortInput.value = defaultPort;
    } 
    updateAll();

});

dbHostInput.addEventListener('input', (e) => { selections.dbHost = e.target.value; updateAll(); });
dbNameInput.addEventListener('input', (e) => { selections.dbName = e.target.value; updateAll(); });
dbUserInput.addEventListener('input', (e) => { selections.dbUser = e.target.value; updateAll(); });
dbPortInput.addEventListener('input', (e) => { selections.dbPort = e.target.value; updateAll(); });

dbPasswordInput.addEventListener('input', (e) => { selections.dbPassword = e.target.value; updateAll(); });

// Filestore Input Listeners
// Event listener for the main filestore selection dropdown
if (filestoreSelect) { // Ensure filestoreSelect element exists
    filestoreSelect.addEventListener('change', (e) => {
        selections.filestoreChoice = e.target.value;
        const fsType = selections.filestoreChoice;
        const isCloud = cloudStorageTypes.includes(fsType);

        if (fsUseCacheCheckbox) { 
            if (isCloud) {
                selections.fsUseCache = true;       
                fsUseCacheCheckbox.checked = true; 
                
            } else {
                fsUseCacheCheckbox.checked = false;
                selections.fsUseCache = false;       

            }
        }
        updateAll(); 
    });
}

fsFileStoreDirInput.addEventListener('input', (e) => { selections.fsFileStoreDir = e.target.value; updateAll(); });
s3BucketNameInput.addEventListener('input', (e) => { selections.s3BucketName = e.target.value; updateAll(); });
s3RegionInput.addEventListener('input', (e) => { selections.s3Region = e.target.value; updateAll(); });
s3EndpointInput.addEventListener('input', (e) => { selections.s3Endpoint = e.target.value || 's3.amazonaws.com'; 

if (!selections.s3Endpoint.endsWith('.amazonaws.com')) {
    //If not s3 endpoint, force keys
    selections.s3AuthMethod = 'keys';
    s3AuthRadios[1].checked = true;
    s3AuthRadios[0].disabled = true;
    s3AuthInfoMessage.textContent = 'IAM Role is only available for AWS S3 endpoints. Please enter access keys.';
    s3AuthInfoMessage.classList.add('visible');
}else{
    //Otherwise select IAM
    s3AuthRadios[0].disabled = false;
    s3AuthRadios[0].checked = true;
    selections.s3AuthMethod = 'IAM';
    s3AuthInfoMessage.textContent = '';
    s3AuthInfoMessage.classList.remove('visible');

    
}
    updateAll(); 
});

s3PathPrefixInput.addEventListener('input', (e) => { selections.s3PathPrefix = e.target.value; updateAll(); });
s3AuthRadios.forEach(radio => radio.addEventListener('change', (e) => { selections.s3AuthMethod = e.target.value; updateAll(); }));
s3IdentityInput.addEventListener('input', (e) => { selections.s3Identity = e.target.value; updateAll(); });
s3CredentialInput.addEventListener('input', (e) => { selections.s3Credential = e.target.value; updateAll(); });
azureAccountNameInput.addEventListener('input', (e) => { selections.azureAccountName = e.target.value; updateAll(); });
azureAccountKeyInput.addEventListener('input', (e) => { selections.azureAccountKey = e.target.value; updateAll(); });
azureContainerNameInput.addEventListener('input', (e) => { selections.azureContainerName = e.target.value; updateAll(); });
azureEndpointInput.addEventListener('input', (e) => { selections.azureEndpoint = e.target.value; updateAll(); });
gcsBucketNameInput.addEventListener('input', (e) => { selections.gcsBucketName = e.target.value; updateAll(); });
gcsPathPrefixInput.addEventListener('input', (e) => { selections.gcsPathPrefix = e.target.value; updateAll(); });
gcsUseInstanceCredentialsInput.addEventListener('change', (e) => { selections.gcsUseInstanceCredentials = e.target.checked; updateAll(); });
// Cache Listeners

fsUseCacheCheckbox.addEventListener('change', (e) => { selections.fsUseCache = e.target.checked; updateAll(); });
fsCacheDirInput.addEventListener('input', (e) => { selections.fsCacheDir = e.target.value || 'cache'; updateAll(); });
fsMaxCacheSizeInput.addEventListener('input', (e) => { selections.fsMaxCacheSize = e.target.value*1000000000 || '5000000000'; updateAll(); });
fsMaxFileSizeLimitInput.addEventListener('input', (e) => { selections.fsMaxFileSizeLimit = e.target.value*1000000000; updateAll(); });
fsSkipDuringUploadCheckbox.addEventListener('change', (e) => { selections.fsSkipDuringUpload = e.target.checked; updateAll(); });


// --- Initial State Setup ---
// Set defaults for debugging
installSelect.value = selections.installType;
installModeSelect.value = selections.installMode;
userRangeSelect.value = selections.userRange;
dbSelect.value = selections.dbChoice;
filestoreSelect.value = selections.filestoreChoice;
// Set DB inputs from state
dbHostInput.value = selections.dbHost;
dbPortInput.value = selections.dbPort;
dbNameInput.value = selections.dbName;
dbUserInput.value = selections.dbUser;
dbPasswordInput.value = selections.dbPassword;
// Set Filestore inputs from state
fsFileStoreDirInput.value = selections.fsFileStoreDir;
fsUseCacheCheckbox.checked = selections.fsUseCache;

updateAll(); // Trigger initial UI updates
