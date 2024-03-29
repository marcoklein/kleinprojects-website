---
title: Using the Raspberry Pi as a Syncthing Server
date: 2022-05-08
tags: [project]
---


<p>Today I reworked my Obsidian infrastructure setup to use Syncthing (<a rel="noopener" class="external-link" href="https://syncthing.net/" target="_blank">https://syncthing.net/</a>) instead of GitHub so I have complete control over my data. In this post I would like to share my setup with you.</p>
<h2 data-heading="Raspberry Pi as Syncthing Main Server">Raspberry Pi as Syncthing Main Server</h2>
<p></p><div><img style="max-width:400px !important; width:100%;" class="excalidraw-svg" src="/images/2022-05-08-2022-05-08 Blog Post - Syncthing on Raspberry PI 2022-05-08 18.03.53.excalidraw.md.svg"></div><br>
The main idea is having the Raspberry Pi as the <em>main</em> Syncthing server that is <em>always online</em>. Through relay servers any other client is able to establish a connection to that main server. This is important as Syncthing would at least need two devices that it can sync files properly within real-time.<p></p>
<p>Let's dive into the technical setup.</p>
<h2 data-heading="Setting up the SD Card">Setting up the SD Card</h2>
<p>Download Raspbian Imager from <a rel="noopener" class="external-link" href="https://www.raspberrypi.com/software/" target="_blank">https://www.raspberrypi.com/software/</a>.<br>
That software writes the Raspbian OS onto your SD Card. Pick <em>Raspberry Lite (no Desktop)</em> and flash your SD Card.</p>
<p>To automatically connect to WIFI place a <code>wpa_supplicant.conf</code> into the SD card root folder with the following content:</p>
<pre><code>country=de
update_config=1
ctrl_interface=/var/run/wpa_supplicant

network={
 scan_ssid=1
 ssid="WiFi SSID"
 psk="WiFi password"
}
</code><button class="copy-code-button">Copy</button></pre>
<p>Additionally, place an empty <code>ssh</code> file into the root. This triggers an SSH login on the first boot.</p>
<h2 data-heading="Connecting to the Raspberry PI">Connecting to the Raspberry PI</h2>
<p>Next, start the Raspberry with the prepared SD Card. It should automatically connect to your network.</p>
<blockquote>
<p>To find the IP you might use an IP Scanner like <a aria-label-position="top" aria-label="https://angryip.org/" rel="noopener" class="external-link" href="https://angryip.org/" target="_blank">Angry IP Scanner</a> or if you have access to your router you can just see listed devices there. If this is your only raspberry pi in the network try to connecting to <code>raspberrypi</code> as ip address.</p>
</blockquote>
<p>Connect to it via SSH:</p>
<pre class="language-sh" tabindex="0"><code class="language-sh is-loaded">ssh pi@&#x3C;raspberry pi ip>
</code><button class="copy-code-button">Copy</button></pre>
<p>Username: <code>pi</code><br>
Password: <code>raspberry</code></p>
<blockquote>
<p>If you encounter troubles just connect to a display via HDMI and see what the logs show.</p>
</blockquote>
<p>After the initial login change the default password to something safe! (or better: enable SSH key authentication only - I will not discuss this here)</p>
<pre class="language-sh" tabindex="0"><code class="language-sh is-loaded">passwd
</code><button class="copy-code-button">Copy</button></pre>
<h2 data-heading="Installing Syncthing">Installing Syncthing</h2>
<p>Syncthing is available as a Debian package at <a rel="noopener" class="external-link" href="https://apt.syncthing.net/" target="_blank">https://apt.syncthing.net/</a>:</p>
<pre class="language-sh" tabindex="0"><code class="language-sh is-loaded">sudo curl -s -o /usr/share/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
echo "deb [signed-by=/usr/share/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
sudo apt-get update
sudo apt-get install syncthing
</code><button class="copy-code-button">Copy</button></pre>
<p>Run Syncthing:</p>
<pre class="language-sh" tabindex="0"><code class="language-sh is-loaded">syncthing
</code><button class="copy-code-button">Copy</button></pre>
<p>And note your device Id<br>
This will print starting logs including the Syncthing ID of the raspberry. The line looks like this:</p>
<pre><code>...
[XXXXX] 2022/05/08 16:17:15 INFO: My ID: XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX
...
</code><button class="copy-code-button">Copy</button></pre>
<h2 data-heading="Exposing the Syncthing Web Console">Exposing the Syncthing Web Console</h2>
<p>There is a CLI for Syncthing but it's much easier to maintain configurations via the web browser. Enable it in the <code>~/.config/syncthing/config.xml</code> by changing the <code>address</code> attribute to a <code>0.0.0.0</code> value like this:</p>
<pre><code>&#x3C;gui enabled="true" tls="true">
 &#x3C;address>0.0.0.0:8384&#x3C;/address>
 &#x3C;apikey>xxxxx&#x3C;/apikey>
&#x3C;/gui>
</code><button class="copy-code-button">Copy</button></pre>
<p>Then, restart syncthing with:</p>
<pre><code>syncthing
</code><button class="copy-code-button">Copy</button></pre>
<p>And access the web console at <code>https://&#x3C;raspberry pi ip>:8384</code>.<br>
Add a new user authentication here to avoid others within the same network of accessing your Syncthing settings. The web console will also prompt you to do this.</p>
<h3 data-heading="Starting Syncthing on Login">Starting Syncthing on Login</h3>
<p>To run Syncthing on startup (e.g. when the Raspberry Pi powers up), we can edit the <code>~/.bashrc</code>file that gets executed on login of the <code>pi</code> user:</p>
<pre class="language-sh" tabindex="0"><code class="language-sh is-loaded">vi ~/.bashrc
</code><button class="copy-code-button">Copy</button></pre>
<p>and add the following line to start syncthing:</p>
<pre><code># ...
# Run Syncthing in detached mode (notice the &#x26;)
syncthing serve &#x26;
</code><button class="copy-code-button">Copy</button></pre>
<p>Note that if you login into the pi user the script will always execute. You can also configure a service to run syncthing with init.d or systemd if you want a cleaner execution. The mentioned approach is very simple and sufficient for my case.</p>
<h2 data-heading="Conclusion">Conclusion</h2>
<p>This guide walked you through the basic setup of Syncthing on a Raspberry Pi.</p>
<p>You can now start your Raspberry Pi to automatically run Syncthing and access the web console to manage all devices and folders.</p>
<p>Consider adding a backup mechanism to your setup to make it even more robust.</p>
    
