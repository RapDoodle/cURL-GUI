const getUserPair = (cmd, usernameFieldId, pwdFieldId) => {
  const usernameField = document.querySelector('#' + usernameFieldId)
  const passwordField = document.querySelector('#' + pwdFieldId)
  if (usernameField.value.length > 0) {
    let arg = cmd + " " + usernameField.value
    if (passwordField.value.length > 0) {
      arg += ":" + passwordField.value
    }
    return arg
  }
  return ""
}

const blueprint = {
  meta: {
    title: "Generate cURL command for HTTP requests",
    apiVersion: "0.1.0"
  },
  command: {
    prefix: "curl",
    suffix: "",
    separator: " ",
    hooks: [
      {
        order: 1,
        hook: () => {
          return getUserPair("-u", "username-input", "password-input")
        }
      },
      {
        order: 1,
        hook: () => {
          return getUserPair("--proxy-user", "proxy-username-input", "proxy-password-input")
        }
      },
    ]
  },
  form: [
    {
      type: "fieldset",
      title: "General",
      form: [
        {
          type: "url",
          label: "URL",
          placeholder: "https://example.com/",
          default: "https://example.com/",
          help: "Specify a URL to fetch.",
          required: true,
          command: {
            order: 255,
            type: "str",
            arg: "",
          },
        },
        {
          type: "select",
          label: "HTTP method",
          help: "The request method to use when communicating with the HTTP server.",
          default: "GET",
          required: true,
          options: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
          ],
          command: {
            order: 1,
            type: "str",
            arg: "-X",
            ignoreDefaultValue: true,
          },
        },
        {
          type: "select",
          label: "HTTP version",
          placeholder: "Please select",
          help: "The HTTP version used to communicate with the server.",
          options: [
            {
              value: "0.9",
              text: "HTTP/0.9"
            },
            {
              value: "1.0",
              text: "HTTP/1.0"
            },
            {
              value: "1.1",
              text: "HTTP/1.1"
            },
            {
              value: "2",
              text: "HTTP/2"
            },
            {
              value: "3",
              text: "HTTP/3 (experimental)"
            },
            {
              value: "3",
              text: "HTTP/3 only (experimental)"
            }
          ],
          command: {
            order: 1,
            type: "flag",
            args: ["--http0.9", "--http1.0", "--http1.1", "--http2", "--http3", "--http3-only"],
          },
        },
        {
          type: "number",
          label: "Max retries",
          placeholder: "0",
          help: "If a transient error is returned when curl tries to perform a transfer, it will retry this number of times before giving up.",
          command: {
            order: 1,
            type: "str",
            arg: "--retry",
            ignoreDefaultValue: true,
          },
        },
        {
          type: "number",
          label: "Timeout",
          placeholder: "0",
          help: "Maximum time in seconds that you allow curl's connection to take.",
          command: {
            order: 1,
            type: "str",
            arg: "--connect-timeout",
          },
          attributes: {
            step: "0.001"
          }
        },
        {
          type: "text",
          label: "Limit rate",
          placeholder: "100M",
          help: "The HTTP version used to communiate with the server.",
          command: {
            order: 1,
            type: "str",
            arg: "--limit-rate",
          },
        },
        {
          type: "number",
          label: "Max redirects",
          id: "max-redirects-input",
          help: "Set maximum number of redirections to follow.",
          default: 50,
          disabled: true,
          command: {
            order: 1,
            type: "str",
            arg: "--retry",
            ignoreOnDisabled: true,
            ignoreDefaultValue: true,
          },
        },
        {
          type: "checkbox-right",
          label: "Follow redirects",
          help: "If the server reports that the requested page has moved to a different location (indicated with a Location: header and a 3XX response code), this option will make curl redo the request on the new place.",
          command: {
            order: 1,
            type: "flag",
            arg: "-L",
          },
          eventListeners: {
            click: (evt) => {
              // Disable Authentication method select when checked
              document.querySelector('#max-redirects-input').disabled = !evt.target.checked
            }
          }
        },
        {
          type: "checkbox-right",
          label: "Only retrieve header",
          help: "Only retrieve header.",
          command: {
            order: 1,
            type: "flag",
            arg: "--head",
          },
        },
      ],
    },
    {
      type: "fieldset",
      title: "Header",
      collapsible: true,
      collapsedOnLoad: false,
      form: [
        {
          type: "textarea",
          label: "Header",
          placeholder: "X-First-Name: Joe",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "-H",
            multilineStrategy: "multiArgs"
          },
        },
        {
          type: "textarea",
          label: "Data",
          id: "data-textarea",
          placeholder: "name=curl",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "-d",
            multilineStrategy: "multiArgs"
          },
        },
        {
          type: "textarea",
          label: "Form",
          placeholder: "name=daniel;type=text/foo",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "-F",
          },
        },
        {
          type: "textarea",
          label: "User agent",
          placeholder: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "-A",
          },
        },
        {
          type: "textarea",
          label: "JSON",
          placeholder: "{ \"drink\": \"coffe\" }",
          help: "Sends the specified JSON data in a POST request to the HTTP server.",
          command: {
            order: 1,
            type: "str",
            arg: "--json",
          },
        },
      ],
    },
    {
      type: "fieldset",
      title: "Authentication",
      togglable: true,
      disabledOnLoad: true,
      collapsible: true,
      collapsedOnLoad: false,
      form: [
        {
          type: "text",
          label: "Username",
          id: "username-input",
          placeholder: "Username",
          help: ""
        },
        {
          type: "password",
          label: "Password",
          id: "password-input",
          placeholder: "Password",
          help: "",
        },
        {
          type: "select",
          label: "Authentication method",
          id: "auth-method-select",
          placeholder: "Please select",
          help: "",
          options: ["HTTP Negotiate", "HTTP NTLM", "HTTP Digest"],
          command: {
            order: 1,
            type: "flag",
            args: ["--negotiate", "--ntlm", "--digest"],
            ignoreOnDisabled: true,
          },
        },
        {
          type: "checkbox-right",
          label: "Use anyauth",
          help: "Tells curl to figure out authentication method by itself, and use the most secure one the remote site claims to support.",
          command: {
            order: 1,
            type: "flag",
            arg: "--anyauth",
          },
          eventListeners: {
            click: (evt) => {
              // Disable Authentication method select when checked
              document.querySelector('#auth-method-select').disabled = evt.target.checked
            }
          }
        },
      ],
    },
    {
      type: "fieldset",
      title: "Output",
      togglable: true,
      disabledOnLoad: true,
      collapsible: true,
      collapsedOnLoad: false,
      form: [
        {
          type: "text",
          label: "Filename",
          id: "filename-input",
          help: "Output filename.",
          disabled: true,
          command: {
            order: 1,
            type: "str",
            arg: "-o",
            ignoreOnDisabled: true,
            ignoreDefaultValue: true,
          },
        },
        {
          type: "checkbox-right",
          label: "Use remote name",
          checked: true,
          eventListeners: {
            click: (evt) => {
              // Disable Authentication method select when checked
              document.querySelector('#filename-input').disabled = evt.target.checked
              document.querySelector('#remote-type-auto-radio').disabled = !evt.target.checked
              document.querySelector('#remote-type-url-radio').disabled = !evt.target.checked
              document.querySelector('#remote-type-header-radio').disabled = !evt.target.checked
            }
          }
        },
        {
          type: "radioGroup",
          label: "Remote name type",
          help: "Choose a remote name type",
          options: ["Auto", "URL", "Header"],
          default: "Auto",
          ids: ['remote-type-auto-radio', 'remote-type-url-radio', 'remote-type-header-radio'],
          command: {
            order: 1,
            type: "flag",
            args: ["-OJ", "-O", "-J"],
            ignoreOnDisabled: true,
          },
        },
      ],
    },
    {
      type: "fieldset",
      title: "Proxy",
      togglable: true,
      disabledOnLoad: true,
      collapsible: true,
      collapsedOnLoad: false,
      form: [
        {
          type: "text",
          label: "Address",
          placeholder: "[protocol://]host[:port]",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "-x",
            ignoreOnDisabled: true,
          },
        },
        {
          type: "select",
          label: "Authentication method",
          id: "auth-method-select",
          placeholder: "Please select",
          help: "",
          options: ["Auto", "HTTP Negotiate", "HTTP NTLM", "HTTP Digest"],
          command: {
            order: 10,
            type: "flag",
            args: ["--proxy-anyauth", "--proxy-negotiate", "--proxy-ntlm", "--proxy-digest"],
            ignoreOnDisabled: true,
          },
        },
        {
          type: "text",
          label: "Username",
          id: "proxy-username-input",
          placeholder: "Username",
          help: ""
        },
        {
          type: "password",
          label: "Password",
          id: "proxy-password-input",
          placeholder: "Password",
          help: "",
        },
        {
          type: "text",
          label: "Preproxy address",
          placeholder: "[protocol://]host[:port]",
          help: "",
          command: {
            order: 1,
            type: "str",
            arg: "--preproxy",
            ignoreOnDisabled: true,
          },
        },
      ],
    },
    {
      type: "fieldset-default",
      title: "Advanced Features",
      collapsible: true,
      collapsedOnLoad: false,
      form: [
        {
          type: "checkbox",
          label: "Include HTTP header in output",
          help: "Include the HTTP response headers in the output.",
          command: {
            order: 1,
            type: "flag",
            arg: "-i",
          },
        },
        {
          type: "checkbox",
          label: "Terminate on transfer error",
          help: "Fail and exit on the first detected transfer error.",
          command: {
            order: 1,
            type: "flag",
            arg: "--fail-early",
          },
        },
        {
          type: "checkbox",
          label: "Terminate on error HTTP status",
          help: "Return an error on server errors where the HTTP response code is 400 or greater).",
          command: {
            order: 1,
            type: "flag",
            arg: "--fail-with-body",
          },
        },
        {
          type: "checkbox",
          label: "No keepalive",
          help: "Disables the use of keepalive messages on the TCP connection. curl otherwise enables them by default.",
          command: {
            order: 1,
            type: "flag",
            arg: "--no-keepalive",
          },
        },
        {
          type: "checkbox",
          label: "No buffer on output stream",
          help: "Disables the buffering of the output stream.",
          command: {
            order: 1,
            type: "flag",
            arg: "--no-buffer",
          },
        },
        {
          type: "checkbox",
          label: "Show detailed operation log (verbose mode)",
          help: "Makes curl verbose during the operation.",
          command: {
            order: 1,
            type: "flag",
            arg: "-v",
          },
        },
      ],
    },
  ],
}
