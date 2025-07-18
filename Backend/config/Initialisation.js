import DataPegawai from '../models/DataPegawaiModel.js';
import DataJabatan from '../models/DataJabatanModel.js';
import argon2 from 'argon2';
import journal from './Journalisation.js';

export default async function initialiserDonnees() {
  try {
    const nb = await DataPegawai.count();
    if (nb === 0) {
      const motPasse = await argon2.hash('admin123');
      const admin = await DataPegawai.create({
        nik: '0000000000000000',
        nama_pegawai: 'Administrateur',
        username: 'admin',
        password: motPasse,
        jenis_kelamin: 'Non spécifié',
        jabatan: 'Administrateur',
        tanggal_masuk: new Date().toISOString().slice(0, 10),
        status: 'Actif',
        photo: 'placeholder.png',
        url: '',
        hak_akses: 'admin'
      });

      await DataJabatan.create({
        nama_jabatan: 'Administrateur',
        gaji_pokok: 0,
        tj_transport: 0,
        uang_makan: 0,
        userId: admin.id
      });

      journal.info("Données initiales créées");
    }
  } catch (err) {
    journal.error(`Échec de l'initialisation: ${err.message}`);
  }
}
