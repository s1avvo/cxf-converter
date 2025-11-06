export function EmailTemplate(
	results: { name: string; result: { space: string; value: string }[] }[]
) {
	const tableRows = results
		.map((color) => {
			const rows = color.result
				.map(
					(r, idx) =>
						`<tr>
                ${
									idx === 0
										? `<td rowspan="${color.result.length}" style="border-bottom: 1px solid #ddd; font-weight: 600; vertical-align: top;">${color.name}</td>`
										: ""
								}
                <td style="border-bottom: 1px solid #ddd;">${r.space}</td>
                <td style="border-bottom: 1px solid #ddd;">${r.value}</td>
              </tr>`
				)
				.join("");
			return rows + `<tr><td colspan="3" style="height: 12px;"></td></tr>`;
		})
		.join("");

	return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 40px 0;
          color: #333333;
        }
        .container {
          max-width: 768px;
          margin: 0 auto;
        }
        h2 {
          font-size: 22px;
          text-align: center;
          color: #111;
          margin-bottom: 24px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 14px;
        }
        th {
          text-align: left;
          padding: 12px 16px;
          font-weight: 600;
          border-bottom: 1px solid #ddd;
        }
        td {
          padding: 12px 16px;
        }
        .footer {
          margin-top: 32px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Color Conversion Results</h2>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Space</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          <p>This email was generated automatically by the CxF Converter tool.</p>
        </div>
      </div>
    </body>
  </html>`;
}
