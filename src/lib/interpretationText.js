import { countOutliers, fmtNum } from "@/lib/general";
import { effectLabel, groupSeries, leveneTest, strengthLabel } from "@/lib/statistics";

export function countWords(paragraphs) {
  return paragraphs
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function cvBand(cv) {
  if (!Number.isFinite(cv)) return { label: "tidak dapat dihitung", meaning: "sebaran belum dapat dibandingkan dengan rata-ratanya" };
  if (cv < 15) return { label: "relatif rendah", meaning: "pengamatan cenderung seragam sehingga nilai berikutnya relatif mudah diperkirakan" };
  if (cv < 30) return { label: "sedang", meaning: "variasi antar pengamatan wajar tanpa nilai yang terlalu menyimpang" };
  return { label: "tinggi", meaning: "keragaman antar pengamatan besar sehingga perlu ditelusuri faktor pembeda di baliknya" };
}

function withinShare(values, mean, sd) {
  if (!values?.length || !sd) return null;
  const inside = values.filter((v) => Math.abs(v - mean) <= sd).length;
  return (inside / values.length) * 100;
}

export function executiveInterpretation(analysis) {
  const {
    dataset,
    stats,
    top,
    bottom,
    difference,
    effectSize,
    correlation,
    secondary,
    completeness,
    missing,
    totalRows,
    profiles,
    numeric,
    measureLabel,
    dimLabel,
    unit,
  } = analysis;
  const cols = profiles.length;
  const cells = totalRows * cols;
  const near = stats ? Math.abs(stats.mean - stats.median) <= stats.stdev * 0.2 : true;
  const cv = stats && stats.mean ? (stats.stdev / Math.abs(stats.mean)) * 100 : NaN;
  const band = cvBand(cv);

  const corrSentence =
    correlation !== null && secondary
      ? `Hubungan ${measureLabel} dengan ${secondary.label} tergolong ${strengthLabel(correlation)} (r = ${fmtNum(
          correlation
        )}) dan bergerak ${correlation >= 0 ? "searah" : "berlawanan arah"}, sehingga kedua variabel sebaiknya dibahas bersama sebagai satu rangkaian bukti.`
      : "Hubungan antar variabel belum dapat dihitung karena belum tersedia kolom numerik kedua yang lengkap, sehingga laporan sebaiknya dibatasi pada pola satu variabel.";

  return [
    `Dataset ${dataset.name} memuat ${totalRows} baris pengamatan pada ${cols} kolom, terdiri atas ${
      numeric.length
    } kolom numerik dan ${
      cols - numeric.length
    } kolom kategorikal. Analisis ini memusatkan perhatian pada ${measureLabel} sebagai ukuran utama dan ${dimLabel} sebagai dimensi pembanding, sehingga pertanyaan yang dijawab adalah seberapa besar nilai ${measureLabel} dan seberapa merata nilainya tersebar di antara kategori yang tersedia. Seluruh angka pada kartu ini dihitung langsung dari data yang diunggah, bukan dari nilai rujukan luar, sehingga setiap pernyataan dalam laporan dapat ditelusuri kembali ke baris data aslinya.`,
    stats
      ? `Secara umum ${measureLabel} memiliki rata-rata ${fmtNum(stats.mean)}${unit} dengan median ${fmtNum(
          stats.median
        )}${unit}. ${
          near
            ? "Kedua ukuran pemusatan tersebut berdekatan, tanda bahwa sebaran relatif seimbang dan nilai ekstrem tidak mendominasi ringkasan."
            : "Jarak antara rata-rata dan median menunjukkan sebaran yang belum sepenuhnya seimbang, sehingga median perlu dibaca berdampingan dengan rata-rata agar kesimpulan tidak berlebihan."
        } Simpangan baku ${fmtNum(stats.stdev)}${unit} menempatkan sebagian besar pengamatan pada rentang ${fmtNum(
          stats.mean - stats.stdev
        )} hingga ${fmtNum(stats.mean + stats.stdev)}${unit}, sedangkan rentang penuh data membentang dari ${fmtNum(
          stats.min
        )} sampai ${fmtNum(stats.max)}${unit}. Koefisien variasi ${fmtNum(cv, 1)}% tergolong ${
          band.label
        }, yang berarti ${band.meaning}.`
      : "Dataset ini belum memiliki kolom numerik yang lengkap untuk menghitung ukuran pemusatan, sehingga ringkasan eksekutif dibatasi pada komposisi data dan sebaran kategori.",
    top
      ? `Temuan paling menonjol adalah posisi ${top.name} dengan rata-rata ${fmtNum(top.value)}${unit}, berjarak ${fmtNum(
          difference
        )}${unit} dari ${bottom?.name || "kategori terendah"} pada ${fmtNum(bottom?.value)}${unit}. Selisih tersebut setara ukuran efek ${
          effectSize === null ? "yang belum dapat dihitung" : `${fmtNum(effectSize)} atau tergolong ${effectLabel(effectSize)}`
        }. ${corrSentence} Kelengkapan data mencapai ${fmtNum(completeness, 1)}% dari ${cells} sel yang diperiksa${
          missing > 0
            ? `, dengan ${missing} sel kosong yang perlu ditinjau sebelum angka dipakai sebagai klaim final`
            : ", tanpa sel kosong yang mengganggu perhitungan"
        }. Dengan membaca seluruh angka tersebut secara bersama, laporan dapat menyatakan bahwa ${measureLabel} pada dataset ini menunjukkan pola yang terukur, dapat dijelaskan, dan layak dijadikan temuan utama.`
      : "Belum ada kategori dengan nilai rata-rata yang dapat dibandingkan, sehingga ringkasan eksekutif hanya memuat gambaran umum dataset dan belum sampai pada temuan pembanding.",
  ];
}

export function descriptiveInterpretation(analysis) {
  const { stats, hist, measure, measureLabel, unit, completeness, missing, totalRows, dataset } = analysis;

  if (!stats) {
    return [
      `Dataset ${dataset.name} belum menyediakan kolom numerik yang cukup untuk dihitung statistik deskriptifnya. Dari ${totalRows} baris yang terbaca, seluruh kolom yang tersedia bersifat kategorikal atau terlalu banyak berisi nilai kosong, sehingga rata-rata, median, dan simpangan baku belum dapat dibentuk secara sahih. Pada kondisi ini interpretasi deskriptif sebaiknya diarahkan pada frekuensi kategori, kelengkapan data, serta pola isian yang menonjol, bukan pada ukuran pemusatan.`,
      `Penyebab paling umum dari kondisi ini adalah kolom angka yang terbaca sebagai teks, misalnya karena memakai koma desimal bercampur titik, menyertakan satuan di dalam sel, atau memuat tanda hubung sebagai penanda nilai kosong. Pemeriksaan sederhana dapat dilakukan dengan membuka kembali berkas sumber, memastikan satu kolom hanya berisi angka dengan satu format desimal yang konsisten, lalu mengunggah ulang data. Setelah kolom numerik tersedia, statistik deskriptif akan menampilkan rata-rata, median, simpangan baku, nilai minimum dan maksimum, sehingga interpretasi dapat menyebut ukuran pemusatan sekaligus keragaman pengamatan. Perlu diingat bahwa statistik deskriptif hanya merangkum data yang ada, sehingga penambahan kolom baru mengubah gambaran secara menyeluruh dan perlu dilaporkan sebagai revisi analisis, bukan sebagai koreksi atas temuan sebelumnya. Tanpa angka yang sahih, setiap pernyataan tentang kecenderungan nilai berisiko menjadi klaim tanpa dasar, sehingga bagian ini sebaiknya ditulis sebagai catatan keterbatasan data.`,
    ];
  }

  const cv = stats.mean ? (stats.stdev / Math.abs(stats.mean)) * 100 : NaN;
  const band = cvBand(cv);
  const share = withinShare(measure?.values, stats.mean, stats.stdev);
  const peak = hist.length ? hist.reduce((a, b) => (b.count > a.count ? b : a)) : null;
  const peakShare = peak ? (peak.count / stats.n) * 100 : 0;
  const skew =
    stats.mean > stats.median
      ? "condong ke kanan karena rata-rata tertarik oleh sejumlah nilai tinggi"
      : stats.median > stats.mean
      ? "condong ke kiri karena rata-rata tertarik oleh sejumlah nilai rendah"
      : "hampir simetris karena kedua ukuran pemusatan hampir sama";
  const outliers = countOutliers(measure?.values || []);

  return [
    `Statistik deskriptif dihitung dari ${stats.n} nilai ${measureLabel} yang valid. Total seluruh nilai mencapai ${fmtNum(
      stats.sum
    )}${unit}, dengan rata-rata ${fmtNum(stats.mean)}${unit} dan median ${fmtNum(stats.median)}${unit}. Rata-rata menggambarkan nilai khas yang diharapkan muncul pada pengamatan baru, sedangkan median menunjukkan titik tengah setelah data diurutkan sehingga lebih tahan terhadap nilai ekstrem. Nilai terkecil ${fmtNum(
      stats.min
    )}${unit} dan nilai terbesar ${fmtNum(stats.max)}${unit} memberi batas nyata rentang pengukuran pada dataset ini, bukan sekadar rentang teoretis.`,
    `Simpangan baku ${fmtNum(stats.stdev)}${unit} menunjukkan rata-rata jarak pengamatan terhadap nilai tengahnya, dengan rentang total ${fmtNum(
      stats.max - stats.min
    )}${unit}. Koefisien variasi ${fmtNum(cv, 1)}% tergolong ${band.label}, yang berarti ${band.meaning}. ${
      share === null
        ? ""
        : `Sekitar ${fmtNum(share, 1)}% pengamatan berada dalam satu simpangan baku dari rata-rata`
    }${share === null ? "" : ", sehingga bagian terbesar data dapat dikatakan berada di sekitar nilai tengah dan bukan di ujung sebaran."} Angka ini penting karena dua kelompok dapat memiliki rata-rata hampir sama namun keragamannya sangat berbeda; tanpa membaca simpangan baku, perbandingan rata-rata berisiko menghasilkan kesimpulan yang menyesatkan.`,
    `Ditinjau dari bentuknya, sebaran ${measureLabel} ${skew}. ${
      peak
        ? `Rentang nilai ${peak.name}${unit} menampung frekuensi terbanyak, yaitu ${peak.count} pengamatan atau sekitar ${fmtNum(
            peakShare,
            1
          )}% dari total,`
        : "Distribusi frekuensi belum dapat dibentuk karena jumlah nilai valid terlalu sedikit,"
    } sehingga bagian data inilah yang paling mewakili kondisi umum. Pemeriksaan nilai ekstrem menemukan ${outliers} pengamatan di luar batas 1,5 kali rentang antarkuartil; ${
      outliers > 0
        ? "nilai tersebut tidak otomatis salah, tetapi perlu diverifikasi ulang sebelum dipakai sebagai dasar interpretasi"
        : "kondisi ini menunjukkan data relatif bersih dari pencilan berat"
    }. Kelengkapan data ${fmtNum(completeness, 1)}%${missing > 0 ? ` dengan ${missing} sel kosong` : " tanpa sel kosong"} menutup gambaran deskriptif ini, karena sel kosong yang dibiarkan dapat menurunkan ketepatan rata-rata dan simpangan baku yang dilaporkan.`,
  ];
}

export function comparisonInterpretation(analysis) {
  const { dataset, dim, measure, groups, top, bottom, difference, effectSize, stats, measureLabel, dimLabel, unit } = analysis;
  const rows = groups.rows || [];
  const series = dim && measure ? groupSeries(dataset, dim.key, measure.key, 12) : [];
  const levene = series.length >= 2 ? leveneTest(series) : null;

  if (!top || rows.length < 2) {
    return [
      `Perbandingan kelompok belum dapat dilakukan karena ${dimLabel} hanya membentuk satu kategori bermakna pada dataset ${dataset.name}. Tanpa minimal dua kelompok, tidak ada nilai rata-rata yang dapat disandingkan, sehingga pernyataan tentang kelompok mana yang lebih tinggi atau lebih rendah tidak memiliki dasar bukti. Kondisi ini biasanya muncul ketika kolom pembanding berisi satu nilai yang sama untuk hampir semua baris, ketika kolom tersebut terlalu banyak memuat sel kosong, atau ketika setiap baris memiliki nilai unik sehingga setiap baris menjadi kelompok tersendiri. Sebagai langkah perbaikan, periksa kembali kolom kategori yang dipakai, gabungkan label yang sebenarnya merujuk pada kelompok yang sama, dan pastikan setiap kelompok memiliki jumlah pengamatan yang memadai. Setelah kelompok terbentuk dengan benar, barulah interpretasi perbandingan dapat disusun dan dilaporkan secara bertanggung jawab.`,
    ];
  }

  const largest = [...rows].sort((a, b) => b.count - a.count)[0];
  const ranking = rows.slice(0, 3);
  const above = stats ? rows.filter((r) => r.value > stats.mean).length : 0;
  const below = rows.length - above;
  const ratio = stats?.stdev ? Math.abs(difference) / stats.stdev : null;

  const homogeneity =
    levene && Number.isFinite(levene.p)
      ? levene.p > 0.05
        ? `Uji Levene menghasilkan W = ${fmtNum(levene.W)} dengan p = ${fmtNum(
            levene.p,
            3
          )}, sehingga varians antar kelompok dapat dianggap setara dan perbandingan rata-rata berada pada dasar yang cukup aman.`
        : `Uji Levene menghasilkan W = ${fmtNum(levene.W)} dengan p = ${fmtNum(
            levene.p,
            3
          )}, sehingga varians antar kelompok berbeda nyata dan perbandingan rata-rata perlu dibaca dengan hati-hati, terutama bila ukuran kelompok tidak seimbang.`
      : "Uji kesamaan varians belum dapat dihitung karena jumlah atau sebaran nilai pada kelompok belum memadai, sehingga perbandingan hanya disajikan secara deskriptif.";

  return [
    `Dimensi ${dimLabel} membentuk ${rows.length} kelompok yang memiliki nilai ${measureLabel} valid. Kelompok terbesar adalah ${
      largest?.name
    } dengan ${largest?.count} pengamatan atau sekitar ${fmtNum(
      (largest?.share || 0) * 100,
      1
    )}% dari seluruh baris, sehingga kelompok ini paling besar pengaruhnya terhadap rata-rata keseluruhan. Tiga kelompok dengan rata-rata tertinggi adalah ${ranking
      .map((r) => `${r.name} (${fmtNum(r.value)}${unit})`)
      .join(", ")}. Urutan ini menggambarkan peringkat relatif pada data yang ada, bukan penilaian mutu kategori, karena perbedaan dapat berasal dari jumlah pengamatan, cara pengukuran, maupun karakteristik bahan yang diuji.`,
    `Rata-rata tertinggi dicapai ${top.name} sebesar ${fmtNum(top.value)}${unit}, sedangkan ${
      bottom?.name
    } berada pada ${fmtNum(bottom?.value)}${unit}, sehingga selisih antarkelompok mencapai ${fmtNum(difference)}${unit}. Bila dibandingkan dengan simpangan baku keseluruhan sebesar ${fmtNum(
      stats?.stdev
    )}${unit}, selisih tersebut setara ${ratio === null ? "ukuran efek yang belum dapat dihitung" : `ukuran efek ${fmtNum(ratio)} yang tergolong ${effectLabel(ratio)}`}. Dari ${rows.length} kelompok, ${above} kelompok berada di atas rata-rata keseluruhan dan ${below} kelompok di bawahnya. Sebaran posisi ini menunjukkan bahwa ${
      Math.abs(ratio || 0) >= 0.5
        ? "perbedaan antar kelompok cukup lebar untuk dianggap penting secara praktis, bukan sekadar fluktuasi kecil"
        : "perbedaan antar kelompok relatif sempit sehingga kategori belum tentu menjadi faktor pembeda yang kuat"
    }.`,
    `${homogeneity} Perlu ditegaskan bahwa angka pada kartu ini bersifat deskriptif: selisih rata-rata belum diuji signifikansinya, sehingga belum dapat diklaim sebagai perbedaan yang berlaku pada populasi di luar dataset. Untuk melengkapi bukti, gunakan panel Homogenitas untuk memeriksa kesamaan varians dan panel Uji Beda untuk melihat hasil uji t atau Mann-Whitney beserta ukuran efeknya. Bila hasil uji tersebut mendukung, temuan perbandingan ini dapat dinaikkan menjadi kesimpulan laporan; bila tidak, pernyataan sebaiknya tetap dibatasi pada kecenderungan data yang diamati.`,
  ];
}

export function conclusionInterpretation(analysis) {
  const {
    dataset,
    stats,
    top,
    bottom,
    difference,
    effectSize,
    correlation,
    secondary,
    completeness,
    missing,
    totalRows,
    measureLabel,
    dimLabel,
    unit,
  } = analysis;

  if (!stats) {
    return [
      `Dari dataset ${dataset.name} yang memuat ${totalRows} baris, analisis belum dapat menghasilkan kesimpulan kuantitatif karena tidak tersedia kolom numerik yang layak dihitung. Yang dapat disimpulkan pada tahap ini adalah bahwa data telah terbaca dan struktur kolomnya dapat dikenali, namun belum cukup untuk menyatakan kecenderungan nilai, perbedaan antarkelompok, maupun hubungan antar variabel. Kesimpulan laporan sebaiknya menyebutkan keterbatasan tersebut secara terbuka agar pembaca tidak menafsirkan kekosongan analisis sebagai hasil yang netral. Langkah berikutnya adalah melengkapi kolom numerik, memastikan format angka konsisten, lalu mengulang proses analisis.`,
      `Dalam penulisan laporan, bagian kesimpulan sebaiknya memuat tiga hal secara berurutan: komposisi data yang berhasil dibaca, alasan mengapa analisis kuantitatif belum dapat dijalankan, serta rencana perbaikan yang akan ditempuh. Pernyataan seperti "data belum dapat dianalisis secara numerik karena tidak tersedia kolom angka yang valid" jauh lebih jujur dan dapat dipertanggungjawabkan daripada menyimpulkan hasil yang tampak netral padahal tidak dihitung. Selain itu, cantumkan jumlah baris, jumlah kolom, dan sumber data agar pembaca dapat menilai kelayakan data sejak awal. Dengan perbaikan format angka, kesimpulan berikutnya dapat disusun berdasarkan ukuran pemusatan, keragaman, perbandingan antarkelompok, dan hubungan antar variabel yang benar-benar terukur, sehingga temuan pada laporan berdiri di atas bukti yang dapat ditelusuri kembali ke baris data aslinya.`,
    ];
  }

  const evidence = `${stats.n} pengamatan valid dengan rata-rata ${fmtNum(stats.mean)}${unit} dan simpangan baku ${fmtNum(
    stats.stdev
  )}${unit}`;

  return [
    `Berdasarkan seluruh bukti yang dihitung, ${measureLabel} pada dataset ${dataset.name} dapat diringkas melalui ${evidence}. ${
      top
        ? `Perbandingan antar ${dimLabel} menunjukkan ${top.name} berada pada posisi tertinggi dengan ${fmtNum(
            top.value
          )}${unit}, sementara ${bottom?.name} berada pada posisi terendah dengan ${fmtNum(
            bottom?.value
          )}${unit}, sehingga selisih ${fmtNum(difference)}${unit} menjadi inti dari temuan pembanding.`
        : "Perbandingan antar kategori belum menghasilkan pola yang dapat disimpulkan."
    } ${
      correlation !== null && secondary
        ? `Hubungan dengan ${secondary.label} tergolong ${strengthLabel(correlation)} (r = ${fmtNum(
            correlation
          )}), yang menambah satu lapis penjelasan terhadap variasi ${measureLabel}.`
        : "Hubungan antar variabel belum dapat disimpulkan karena keterbatasan kolom numerik."
    }`,
    `Kesimpulan ini harus dibaca dalam batas ruang lingkupnya. Analisis bersifat deskriptif, sehingga pernyataan tentang kecenderungan, selisih, dan hubungan tidak otomatis berlaku sebagai hubungan sebab akibat maupun sebagai generalisasi untuk populasi yang lebih luas. Ukuran sampel ${totalRows} baris turut menentukan seberapa jauh temuan dapat digeneralisasi, dan kelengkapan data ${fmtNum(
      completeness,
      1
    )}%${missing > 0 ? ` dengan ${missing} sel kosong` : " tanpa sel kosong"} memengaruhi ketepatan setiap angka yang dilaporkan. ${
      effectSize !== null && Math.abs(effectSize) >= 0.5
        ? "Meski demikian, ukuran efek antar kelompok tergolong cukup besar sehingga perbedaan yang teramati layak dilaporkan sebagai temuan penting, bukan sekadar variasi kecil."
        : "Ukuran efek antar kelompok masih tergolong kecil, sehingga perbedaan yang teramati sebaiknya dilaporkan sebagai kecenderungan awal yang membutuhkan bukti tambahan."
    }`,
    `Sebagai penutup, tiga langkah dapat ditindaklanjuti. Pertama, verifikasi baris dengan nilai ekstrem dan lengkapi sel kosong agar ringkasan statistik lebih stabil. Kedua, jalankan uji lanjutan pada panel Normalitas, Homogenitas, dan Uji Beda untuk memastikan apakah perbedaan antar ${dimLabel} bertahan secara statistik. Ketiga, gunakan temuan ini sebagai dasar pembahasan, bukan sebagai klaim akhir, dengan menyebutkan jumlah pengamatan dan sumber data secara eksplisit. Dengan demikian, kesimpulan yang disusun tetap jujur pada data, dapat dipertanggungjawabkan secara metodologis, dan siap dipindahkan ke bagian hasil dan pembahasan laporan penelitian.`,
  ];
}