import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Presensi } from "@/constants/data";

interface PresensiPdfProps {
    data: Presensi[];
}

export const handlePrintPresensi = ({ data }: PresensiPdfProps) => {
    const totalJamKerja = (jamMasuk: string, jamPulang: string) => {
        const jam_masuk = new Date(`1970-01-01T${jamMasuk}`);
        const jam_pulang = new Date(`1970-01-01T${jamPulang}`);
        
        // Hitung selisih waktu dalam milidetik
        const selisihMs = jam_pulang.getTime() - jam_masuk.getTime();
        
        // Konversi milidetik ke jam, menit, dan detik
        const totalDetik = Math.floor(selisihMs / 1000);
        const jam = Math.floor(totalDetik / 3600);
        const menit = Math.floor((totalDetik % 3600) / 60);
        const detik = totalDetik % 60;
        
        // Tampilkan hasil dalam format "X jam Y menit Z detik"
        return `${jam} jam ${menit} menit ${detik} detik`
                        
    }
    const doc = new jsPDF();
    
        autoTable(doc, {
            body: [
                    [
                        {
                            content: "PT Parikesit Brayan Nusantara",
                            styles: {
                            halign: "left",
                            fontSize: 15,
                            textColor: [0, 128, 0],
                            },
                        },
                        {
                            content: "Rekap Presensi",
                            styles: {
                            halign: "right",
                            fontSize: 15,
                            },
                        },
                    ],
                ],
                theme: "plain",
            });
        
            autoTable(doc, {
                body: [
                        [
                            {
                                content:
                                "Tanggal Cetak : " +
                                new Date().getDate().toString().padStart(2, "0") +
                                " " +
                                [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ][new Date().getMonth()] +
                                " " +
                                new Date().getFullYear() +
                                " " +
                                new Date().getHours().toString().padStart(2, "0") +
                                ":" +
                                new Date().getMinutes().toString().padStart(2, "0"),
                                styles: {
                                halign: "left",
                                fontSize: 10,
                                },
                            },
                        ],
                    ],
                    theme: "plain",
                });
            
                autoTable(doc, {
                    head: [
                            [
                                "No",
                                "Nama",
                                "Tanggal",
                                "Jam Masuk",
                                "Jam Pulang",
                                "Total Jam Kerja",
                                "Keterangan",
                            ],
                        ],
                        body: data.map((item, index) => [
                                index + 1,
                                item.nama,
                                item.tanggal,
                                item.jamMasuk,
                                item.jamPulang,
                                totalJamKerja(item.jamMasuk, item.jamPulang),
                                item.status
                        ]),
                    theme: "plain",
                });
                    
        doc.save("RekapPresensi.pdf");
}