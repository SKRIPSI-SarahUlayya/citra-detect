**SOFTWARE REQUIREMENTS SPECIFICATION (SRS) - WEB CITRADETECT**

**1. Pendahuluan**
*   **Tujuan Sistem:** Sistem ini dibangun untuk mendeteksi kualitas visual citra *AI-generated* pada platform media sosial (khususnya *feed* Instagram) menggunakan arsitektur *Convolutional Neural Network* (CNN). Sistem juga mengintegrasikan metode *Explainable AI* (XAI) melalui algoritma Grad-CAM untuk memberikan penjelasan visual mengenai area spesifik pada citra yang memengaruhi keputusan model.
*   **Batasan Sistem:**
    *   Input sistem difokuskan pada **citra statis (foto) dengan format RGB** dan tidak mendukung pemrosesan data video.
    *   Analisis hanya dilakukan pada aspek visual citra, sehingga sistem **tidak memproses teks atau *caption*** dari unggahan Instagram.
    *   Objek citra yang diproses bersifat campuran, mencakup wajah manusia maupun objek umum lainnya.
    *   Sistem hanya menggunakan **satu jenis model (CNN)** tanpa membandingkannya dengan metode klasifikasi lain.
    *   Sumber data mencakup dataset publik terbuka dan citra langsung dari *feed* Instagram.

**2. Kebutuhan Fungsional (*Functional Requirements*)**
Berdasarkan *requirement* fungsional yang dirancang, sistem wajib memiliki kemampuan berikut:
*   **Menerima Input Citra Digital:** Sistem harus memiliki fungsi untuk menerima input berupa dataset citra digital dari pengguna.
*   **Melakukan *Preprocessing* Citra:** Sistem harus mampu memproses awal data citra masukan, yang secara spesifik meliputi proses *resize* (penyesuaian ukuran) dan normalisasi citra.
*   **Melatih dan Menguji Model CNN:** Sistem harus memiliki fungsi untuk mengeksekusi model *deep learning* (CNN) guna mengekstraksi fitur visual (seperti tekstur dan pola) pada citra latih dan uji.
*   **Mengklasifikasikan Kualitas Visual:** Sistem harus mampu menentukan label kualitas visual dari citra *AI-generated* yang diproses.
*   **Kalkulasi Metrik Evaluasi:** Sistem harus bisa menghitung dan menampilkan kinerja model berdasarkan parameter pengujian yaitu **akurasi, presisi, *recall*, dan F1-score**.
*   **Menampilkan Visualisasi Grad-CAM:** Sistem harus memproses peta fitur pada *layer* konvolusi terakhir untuk menghasilkan peta panas (*heatmap*) yang memvisualisasikan area penting penentu keputusan klasifikasi.

**3. Kebutuhan Data (*Data Requirements*)**
Untuk mendukung proses pengolahan dan analisis, sistem mewajibkan pengelolaan jenis data berikut:
*   Dataset berisi **citra *AI-generated*** yang dihasilkan oleh model *Artificial Intelligence*.
*   Dataset berisi **citra asli (*real images*)** yang bersumber langsung dari dokumentasi kamera pada *feed* Instagram.
*   Data hasil evaluasi performa klasifikasi sistem.

**4. Interaksi dan Pemodelan Sistem**
*   **Pengguna Sistem (Diagram Konteks):** Sistem berinteraksi dengan satu entitas eksternal utama, yaitu **Peneliti (sebagai pengguna sistem)**, yang bertukar data secara langsung dengan pusat pemrosesan sistem deteksi.
*   **Fungsi Pengguna (*Use Case*):** Melalui sistem, pengguna dapat melakukan aktivitas: menginput dataset citra, melakukan *preprocessing*, melatih model CNN, menguji model, menampilkan hasil klasifikasi, serta menampilkan visualisasi Grad-CAM.
*   **Alur Sistem (*Activity Diagram*):** Sistem beroperasi secara berurutan (*Input-Process-Output*) yang diawali dengan input dataset, dilanjutkan dengan *preprocessing*, proses pelatihan dan pengujian CNN, klasifikasi kualitas visual, dan diakhiri dengan visualisasi Grad-CAM.

**5. Kebutuhan Lingkungan Implementasi (*Environment*)**
Sistem bagian belakang (*core machine learning* dan pemrosesan data) ini akan diimplementasikan sepenuhnya menggunakan **bahasa pemrograman Python**, dibantu dengan *library* pendukung yang relevan untuk mengeksekusi model CNN dan visualisasi XAI.