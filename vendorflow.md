flowchart TB

%% Seller Section
A1[Welcome Screen]
A2[Create Store - Store Name, Owner, Phone OTP]
A3[Minimal KYC - Upload ID or Skip]
A4[Store Dashboard - Default Role: Vendor]
A5[Choose Category]
A6[Select Category]
A7[Fill Category Details]
A8[Add Bank Details]
A9[Upload Branding - Logo, Banner, Description]
A10[Add First Product]
A11[Submit for Review]

%% System Section
S1[Verify OTP]
S2[Create Store Record - role = vendor]
S3[Save KYC Status]
S4[Show Dashboard & Checklist]
S5[Auto Document Verification]
S6[Auto Bank Verification]

%% Admin Section
AD1[Manual Review Queue]
AD2[Approve Store]
AD3[Request More Info]

%% Flow Connections
A1 --> A2
A2 --> S1
S1 --> S2
S2 --> A3
A3 --> S3
S3 --> A4
A4 --> A5
A5 --> A6
A6 --> A7
A7 --> A8
A8 --> S6
A8 --> A9
A9 --> A10
A10 --> S5
S5 --> A11
A11 --> S5
S5 --> AD1
AD1 --> AD2
AD1 --> AD3
AD2 --> A4
AD3 --> A4
