use std::process::{Command, Stdio};
use tauri::path::BaseDirectory;


fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Ruta a la carpeta binaries dentro de resources
            let resource_dir = app
                .path()
                .resolve("binaries", BaseDirectory::Resource)
                .expect("No se pudo resolver resource_dir");

            let java_exe = resource_dir.join("jre/bin/java.exe");
            let jar_path = resource_dir.join("Administracion-Gestion-Inventario-0.0.1-SNAPSHOT.jar");

            println!("Lanzando: {:?} -jar {:?}", java_exe, jar_path);

            // Lanza el backend sin usar hilos adicionales
            let _child = Command::new(java_exe)
                .arg("-Djasypt.encryptor.password=jhon8859")
                .arg("-jar")
                .arg(jar_path)
                .stdout(Stdio::null())        // evita ventanas negras
                .stderr(Stdio::null())
                .spawn()
                .expect("Error al ejecutar el backend Java");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error al ejecutar Tauri");
}