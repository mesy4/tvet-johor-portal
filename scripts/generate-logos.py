import os

os.makedirs("public/images/partners", exist_ok=True)

logos = {
    "kerajaan-johor-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#ffffff" stroke="#003399" stroke-width="2"/>
  <circle cx="40" cy="40" r="22" fill="#003399"/>
  <path d="M40 22 L48 34 L40 30 L32 34 Z" fill="#CC0000"/>
  <path d="M40 58 L48 46 L40 50 L32 46 Z" fill="#CC0000"/>
  <text x="72" y="38" fill="#003399" font-family="Arial,sans-serif" font-size="13" font-weight="bold">Kerajaan</text>
  <text x="72" y="56" fill="#CC0000" font-family="Arial,sans-serif" font-size="12" font-weight="bold">Negeri Johor</text>
</svg>''',

    "jtm-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#004d40"/>
  <path d="M30 20 L50 20 L40 45 Z" fill="#ffffff" opacity="0.9"/>
  <rect x="35" y="48" width="10" height="16" rx="2" fill="#ffffff" opacity="0.9"/>
  <text x="62" y="38" fill="#ffffff" font-family="Arial,sans-serif" font-size="11" font-weight="bold">Jabatan</text>
  <text x="62" y="55" fill="#80cbc4" font-family="Arial,sans-serif" font-size="10" font-weight="bold">Tenaga Manusia</text>
</svg>''',

    "jpk-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#0d47a1"/>
  <circle cx="40" cy="40" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
  <path d="M40 20 L50 40 L40 60 L30 40 Z" fill="#ff9800"/>
  <text x="74" y="35" fill="#ffffff" font-family="Arial,sans-serif" font-size="11" font-weight="bold">Jabatan</text>
  <text x="74" y="50" fill="#bbdefb" font-family="Arial,sans-serif" font-size="9" font-weight="bold">Pembangunan Kemahiran</text>
</svg>''',

    "jtdc-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#1a237e"/>
  <rect x="20" y="20" width="40" height="40" rx="8" fill="#cc0000" opacity="0.3"/>
  <text x="32" y="47" fill="#ffffff" font-family="Arial,sans-serif" font-size="14" font-weight="bold" text-anchor="middle">JT</text>
  <text x="80" y="40" fill="#ffffff" font-family="Arial,sans-serif" font-size="12" font-weight="bold">JTDC</text>
  <text x="80" y="56" fill="#c5cae9" font-family="Arial,sans-serif" font-size="8" font-weight="bold">Johor Talent Development</text>
</svg>''',

    "adtec-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#003366"/>
  <path d="M25 25 L55 25 L40 50 Z" fill="#F5C518"/>
  <rect x="35" y="52" width="10" height="12" rx="2" fill="#ffffff"/>
  <text x="75" y="36" fill="#ffffff" font-family="Arial,sans-serif" font-size="13" font-weight="bold">ADTEC</text>
  <text x="75" y="53" fill="#F5C518" font-family="Arial,sans-serif" font-size="9" font-weight="bold">Pasir Gudang</text>
</svg>''',

    "kesuma-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#b71c1c"/>
  <circle cx="40" cy="40" r="22" fill="#ffffff" opacity="0.2"/>
  <text x="40" y="46" fill="#ffffff" font-family="Arial,sans-serif" font-size="11" font-weight="bold" text-anchor="middle">M</text>
  <text x="72" y="36" fill="#ffffff" font-family="Arial,sans-serif" font-size="11" font-weight="bold">KESUMA</text>
  <text x="72" y="52" fill="#ffcdd2" font-family="Arial,sans-serif" font-size="8" font-weight="bold">Kementerian Sumber Manusia</text>
</svg>''',

    "ptpk-logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="6" fill="#00695c"/>
  <path d="M25 30 L55 30 L40 15 Z" fill="#ffffff" opacity="0.9"/>
  <rect x="35" y="35" width="10" height="20" rx="2" fill="#ffffff" opacity="0.9"/>
  <text x="74" y="42" fill="#ffffff" font-family="Arial,sans-serif" font-size="12" font-weight="bold">PTPK</text>
  <text x="74" y="57" fill="#b2dfdb" font-family="Arial,sans-serif" font-size="7" font-weight="bold">Tabung Pembangunan Kemahiran</text>
</svg>''',
}

for filename, content in logos.items():
    with open(f"public/images/partners/{filename}", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {filename}")

print("\nAll logos created!")
