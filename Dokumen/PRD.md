**PRODUCT REQUIREMENTS DOCUMENT (PRD) - WEB CITRADETECT**

**1. Informasi Umum**
*   **Nama Produk:** CitraDetect (Web Based)
*   **Tujuan Utama:** Membangun sistem web yang mampu mendeteksi kualitas visual citra *AI-generated* (khususnya dari *feed* Instagram) secara otomatis menggunakan *Convolutional Neural Network* (CNN), serta memberikan penjelasan visual yang transparan mengenai area citra yang menjadi dasar keputusan model menggunakan metode Grad-CAM.

**2. Latar Belakang Masalah**
Citra *AI-generated* saat ini semakin sulit dibedakan dari citra asli manusia, dan penyebarannya di media sosial (seperti Instagram) sering mengalami penurunan kualitas akibat proses kompresi dan distribusi otomatis oleh platform. Banyak model *deep learning* saat ini berfokus pada deteksi tanpa mengkaji kualitas visual, dan bersifat *black-box* (tidak transparan). Web ini dibangun untuk mengatasi kesenjangan tersebut dengan menghadirkan analisis deteksi kualitas visual yang memiliki interpretabilitas tinggi.

**3. Target Pengguna**
*   **Peneliti/Akademisi:** Menggunakan sistem untuk keperluan analisis model, pengujian dataset citra RGB, dan evaluasi hasil CNN.
*   **Pengguna Umum Media Sosial:** Menggunakan web untuk mengetahui kualitas visual konten berbasis AI.
*   **Pengelola Platform Media Sosial:** Sebagai acuan dasar atau sistem evaluasi konten visual yang akuntabel dan transparan.

**4. Ruang Lingkup dan Batasan Sistem**
Sistem web harus mematuhi batasan masalah berikut:
*   Hanya memproses input berupa **citra statis (foto)** dengan format RGB.
*   Sistem tidak mendukung pemrosesan data video atau analisis teks/caption dari unggahan media sosial.
*   Sistem menggunakan *Convolutional Neural Network* (CNN) sebagai satu-satunya model analisis klasifikasi utama.
*   Sistem dirancang untuk menganalisis citra campuran, mencakup wajah manusia dan objek umum lainnya.

**5. Kebutuhan Fungsional (Fitur Utama Web)**
Berdasarkan rancangan *Input-Process-Output* (IPO) dan *Use Case*, sistem web harus memiliki fitur-fitur berikut:
*   **Fitur Input/Unggah Citra:** Web harus menyediakan antarmuka bagi pengguna untuk menginput atau mengunggah dataset citra digital (citra *AI-generated* atau citra asli dari *feed* Instagram).
*   **Modul *Preprocessing* Otomatis:** Setelah citra diunggah, web secara otomatis di latar belakang (*back-end*) melakukan *resize* dan normalisasi citra agar sesuai dengan format yang dibutuhkan model.
*   **Fitur Klasifikasi Kinerja (CNN Engine):** Web menjalankan model CNN terlatih untuk mengekstraksi fitur visual (ketajaman, tekstur, artefak kompresi) dan mengklasifikasikan kualitas visual citra.
*   **Fitur *Explainable AI* (Visualisasi Grad-CAM):** Web memproses peta fitur pada *layer* konvolusi terakhir untuk menghasilkan peta panas (*heatmap*) yang menandai area spesifik pada citra yang memengaruhi keputusan model.
*   **Halaman Hasil Klasifikasi (Output Dashboard):** Menampilkan informasi secara transparan kepada pengguna, yang mencakup:
    *   Label hasil klasifikasi kualitas visual citra *AI-generated*.
    *   Visualisasi gambar Grad-CAM (menampilkan citra asli yang disandingkan/ditimpa dengan *heatmap*).
    *   Informasi performa/evaluasi model (akurasi, presisi, *recall*, dan F1-score) sebagai referensi nilai keandalan.

**6. Alur Pengguna (User Flow / Activity)**
Berdasarkan *Activity Diagram* dari rancangan sistem, alur pengguna pada web CitraDetect adalah sebagai berikut:
1.  Pengguna membuka halaman utama web dan mengunggah gambar.
2.  Sistem melakukan *preprocessing* terhadap gambar tersebut.
3.  Sistem mengeksekusi model CNN yang sudah melalui proses pelatihan dan pengujian sebelumnya.
4.  Sistem mengklasifikasikan kualitas visual citra.
5.  Sistem membangkitkan visualisasi Grad-CAM.
6.  Pengguna dialihkan ke halaman hasil untuk melihat label klasifikasi akhir dan meninjau visualisasi *heatmap* Grad-CAM yang menjelaskan keputusan tersebut.

**7. Kebutuhan Non-Fungsional (Teknis)**
*   **Bahasa Pemrograman:** Sistem bagian belakang (*back-end*) atau *core machine learning* diimplementasikan menggunakan bahasa pemrograman **Python** beserta *library* pendukungnya.

Rancangan PRD di atas disarikan langsung dari bab metodologi, tujuan penelitian, dan batasan masalah dalam dokumen proposal tugas akhir Anda.