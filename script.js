// mengambil semua element yang diperlukan
      // dan memasukanya kedalam variable elements
      const elements = {
        game: document.getElementById("game"),
        home: document.getElementById("home"),
        alert: document.getElementById("alert"),
        peringkat: document.getElementById("peringkat"),
        mazeContainer: document.getElementById("maze"),
        timerDisplay: document.getElementById("timer"),
        tombolBantuan: document.getElementById("bantuan"),
        homeBtn: document.getElementById("homeBtn"),
        gameBtn: document.getElementById("gameBtn"),
        usernameInput: document.querySelector("[name=username]"),
      };

      const mazeSize = 10;
      const endPosition = { x: 9, y: 9 };
      let playerPosition = { x: 0, y: 0 };
      let walls = [];
      let gameTimer;
      let waktuMenghafal = 10;
      let waktuBermain = 20;
      let izinkanBergerak = false;
      let darah = 5;
      let skor = 0;
      let bantuan = 1;
      let gameDimulai = false;
      let helpTimer;
      let username = "";

      // mengambil data users
      let users = localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : [];

      // fungsi untuk menampilkan halaman
      function navigasiKe(pageName) {
        // mengambil semua element halaman dan memasukanya kedalam sebuah array
        const halaman = [elements.home, elements.game, elements.peringkat];
        // menambahkan class hidde kesemua halaman agar kodisinya sama
        // disini menggunakan fungsi forEach bawaan array di javascript
        halaman.forEach((item, index) => item.classList.add("hidde"));

        // setelah itu ganti class yang hidde dengan class show untuk halaman yang ingin ditampilkan
        elements[pageName].classList.replace("hidde", "show");

        // menggunakan fungsi switch untuk memilih logika mana yang akan digunakan ketika berpindah halaman
        switch (pageName) {
          case "home": {
            hiddeAlert();
            stopGame();
            break;
          }
          case "game": {
            resetGame();
            break;
          }
          case "peringkat": {
            membuatPapanPeringkat();
            break;
          }
          default: {
            hiddeAlert();
            stopGame();
            break;
          }
        }
      }

      // fungsi untuk menampilkan alert saat game berakhir
      function showAlert() {
        elements.alert.style.display = "grid";
        clearInterval(gameTimer);
        document.getElementById("nama").textContent = username;
        document.getElementById("skorAlert").textContent = skor;
      }

      //fungsi untuk menyembunyikan alert
      function hiddeAlert() {
        // menghilangkan alert dengan cara mengubah style.display ke nilai 'none'
        elements.alert.style.display = "none";
      }

      // fungsi untuk menyimpan data username
      function simpanUsername(newUsername) {
        // jika username sudah ada maka tidak akan disimpan lagi
        if (users.some((item) => item.username == newUsername)) return;

        // menyimpan username yang baru kedalam variable users
        users = [...users, { username: newUsername, skor: 0 }];

        // memasukan data users yang baru kedalam local storage
        localStorage.setItem("users", JSON.stringify(users));
      }

      // fungsi untuk simpan skor setelah game selesai
      function simpanSkor() {
        // mengupdate data skor berdasarkan user yang sedang main saat ini
        // disini menggunakan fungsi map bawaan array di javascript untuk mengupdate datanya
        users = users.map((user) => {
          // mencocokan username yang ada di data users dengan username yang sedang bermain
          if (user.username == username) {
            // jika username cocok maka data skor dengan username tersebut akan diupdate
            // dan data yang sudah di update akan dikembalikan
            return {
              ...user,
              // update skor (skor lama + skor baru)
              skor: skor + user.skor,
            };
          }
          // mengem balikan data user yang tidak di update
          return user;
        });

        // setelah mengupdate data users, data disimpan kedalam local storage
        localStorage.setItem("users", JSON.stringify(users));
      }

      // menambahkan event saat tombol play di klik
      elements.gameBtn.addEventListener("click", () => {
        // mengambil nilai username yang ada pada element input username
        username = elements.usernameInput.value;

        // mengecek apakah usernamenya sudah di input apa belum
        // jika belum makan tidak bisa masuk kedalam gamenya
        if (username == "") return;

        // menyimpan username
        simpanUsername(username);

        // navigasi ke halaman game
        navigasiKe("game");
      });

      // fungsi update darah
      function updateDarah() {
        document.getElementById("darah").textContent = `Darah : ${"❤".repeat(
          darah
        )}`;
        if (darah <= 0) {
          endGame();
          return;
        }
      }

      function generateMazeGrid() {
        // Generate maze grid
        for (let y = 0; y < mazeSize; y++) {
          for (let x = 0; x < mazeSize; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            elements.mazeContainer.appendChild(cell);
          }
        }
      }

      // membuat papan peringkat
      function membuatPapanPeringkat() {
        // mengambil element container peringkat
        const peringkatContainer = document.querySelector(
          ".peringkat-container"
        );

        // mengecek data users
        // jika data users tidak ada maka akan dibuatkan tampilan user tidak ada
        if (!users) {
          peringkatContainer.innerHTML = `<div class="peringkat-item">
            Data Pengguna Kosong
          </div>`;
        }

        // jika data users ada
        // mereset isi container peringkat,
        // hanya berisi judul table peringkat
        // No |    Nama   |  Total Skor
        peringkatContainer.innerHTML = `<div class="peringkat-item">
            <span class="no-peringkat">No</span>
            <span class="nama-peringkat">Username</span>
            <span class="skor-peringkat">Total Skor</span>
          </div>`;

        // mengurutkan data menggunakan fungsi sort bawaan array javascript
        // mengurutkan dari yang terbesar ke terkecil skornya
        const sortedUsers = users.sort(
          (userA, userB) => userB.skor - userA.skor
        );

        // kemudian setiap data akan dibuat item peringkatnya
        sortedUsers.forEach((user, index) => {
          // membuat element item peringkat yang akan menampung semua item peringkat
          const peringkatItem = document.createElement("div");
          // element NO
          const noPeringkat = document.createElement("span");
          // element Nama
          const namaPeringkat = document.createElement("span");
          // element Skor
          const skorPeringkat = document.createElement("span");

          // menambahkan class ke element
          peringkatItem.classList.add("peringkat-item");
          noPeringkat.classList.add("no-peringkat");
          namaPeringkat.classList.add("nama-peringkat");
          skorPeringkat.classList.add("skor-peringkat");

          // mengisi isi konten
          noPeringkat.textContent = index + 1;
          namaPeringkat.textContent = user.username;
          skorPeringkat.textContent = user.skor;

          // memasukan setiap konten ke item perinkat
          peringkatItem.appendChild(noPeringkat);
          peringkatItem.appendChild(namaPeringkat);
          peringkatItem.appendChild(skorPeringkat);

          // memasukan item peringkat ke container
          peringkatContainer.appendChild(peringkatItem);
        });
      }

      // fungsi untuk mengupdate posisi pemain
      function updatePlayerPosition() {
        document
          .querySelectorAll(".cell")
          .forEach((cell) => cell.classList.remove("player"));
        const playerCell = document.querySelector(
          `[data-x='${playerPosition.x}'][data-y='${playerPosition.y}']`
        );
        playerCell.classList.add("player");
      }

      // fungsi untuk menempatkan akhir
      function placeEndPoint() {
        const endCell = document.querySelector(
          `[data-x='${endPosition.x}'][data-y='${endPosition.y}']`
        );
        endCell.classList.add("end");
      }

      // membuat jalur game
      function generateMazePath() {
        walls = [];
        for (let y = 0; y < mazeSize; y++) {
          for (let x = 0; x < mazeSize; x++) {
            if (x !== playerPosition.x || y !== playerPosition.y) {
              walls.push({ x, y });
            }
          }
        }
        let x = 0,
          y = 0;
        walls = walls.filter((cell) => cell.x !== x || cell.y !== y);
        while (x < mazeSize - 1 || y < mazeSize - 1) {
          const direction = Math.random() > 0.5 ? "x" : "y";
          if (direction === "x" && x < mazeSize - 1) x++;
          else if (y < mazeSize - 1) y++;
          walls = walls.filter((cell) => cell.x !== x || cell.y !== y);
        }
        placeWalls();
      }

      // fungsi untuk mereset skor
      function resetSkor() {
        skor = 0;
        document.getElementById("skor").textContent = `Skor: ${skor}`;
      }

      // menampilkan dinding
      function placeWalls() {
        document
          .querySelectorAll(".cell")
          .forEach((cell) => cell.classList.remove("wall", "hidden-wall"));
        walls.forEach((wall) => {
          const wallCell = document.querySelector(
            `[data-x='${wall.x}'][data-y='${wall.y}']`
          );
          if (wallCell) wallCell.classList.add("wall");
        });
      }

      //   fungsi untuk menyembunyikan dinding
      function hideWalls() {
        document
          .querySelectorAll(".wall")
          .forEach((cell) => cell.classList.add("hidden-wall"));
      }

      //   fungsi untuk menampilkan dinding
      function unhideWalls() {
        document
          .querySelectorAll(".wall")
          .forEach((cell) => cell.classList.remove("hidden-wall"));
      }

      // update view bantuan
      function updateBantuan() {
        elements.tombolBantuan.textContent = `Bantuan: ${bantuan}`;
      }

      // disable bantuan
      function disableBantuan() {
        elements.tombolBantuan.disabled = true;
      }

      // aktifkan bantuan
      function aktifkanBantuan() {
        elements.tombolBantuan.disabled = false;
      }

      elements.tombolBantuan.addEventListener("click", async () => {
        if (bantuan > 0) {
          unhideWalls();
          helpTimer = setTimeout(() => {
            hideWalls();
            clearTimeout(helpTimer);
          }, 5000);
          bantuan -= 1;
          elements.tombolBantuan.textContent = `Bantuan: ${bantuan}`;
        }
      });

      // Handle movement
      document.addEventListener("keydown", (e) => {
        if (!izinkanBergerak) return;
        let newX = playerPosition.x;
        let newY = playerPosition.y;
        switch (e.key) {
          case "ArrowUp":
            newY =
              playerPosition.y > 0 ? playerPosition.y - 1 : playerPosition.y;
            break;
          case "ArrowDown":
            newY =
              playerPosition.y < mazeSize - 1
                ? playerPosition.y + 1
                : playerPosition.y;
            break;
          case "ArrowLeft":
            newX =
              playerPosition.x > 0 ? playerPosition.x - 1 : playerPosition.x;
            break;
          case "ArrowRight":
            newX =
              playerPosition.x < mazeSize - 1
                ? playerPosition.x + 1
                : playerPosition.x;
            break;
        }

        if (!isWall(newX, newY)) {
          playerPosition.x = newX;
          playerPosition.y = newY;
          updatePlayerPosition();
          updateSkor();
          checkWin();
        } else if (isWall(newX, newY)) {
          darah--;
          updateDarah();
          waktuBermain = 21;
        } else {
          endGame();
        }
      });

      //   fungsi update skor
      function updateSkor() {
        skor += 1;
        document.getElementById("skor").textContent = `Skor: ${skor}`;
      }
      function isWall(x, y) {
        return walls.some((wall) => wall.x === x && wall.y === y);
      }

      function checkWin() {
        if (
          playerPosition.x === endPosition.x &&
          playerPosition.y === endPosition.y
        ) {
          endGame();
        }
      }

      function resetGame() {
        console.log("reset");
        clearInterval(gameTimer);
        darah = 5;
        updateDarah();
        hiddeAlert();
        resetSkor();
        bantuan = 1;
        updateBantuan();
        disableBantuan();
        playerPosition = { x: 0, y: 0 };
        updatePlayerPosition();
        generateMazePath();
        mulaiMenghafalDanBermain();
      }

      // fungsi stopGame
      function stopGame() {
        elements.usernameInput.value = "";
        clearInterval(gameTimer);
        darah = 5;
        updateDarah();
        resetSkor();
        bantuan = 1;
        updateBantuan();
        disableBantuan();
      }

      function mulaiMenghafalDanBermain() {
        waktuMenghafal = 10;
        waktuBermain = 21;
        elements.timerDisplay.innerText = `Menghafal jalur: ${waktuMenghafal}`;
        gameTimer = setInterval(() => {
          if (waktuMenghafal > 0) {
            izinkanBergerak = false;
            waktuMenghafal = waktuMenghafal - 1;
            elements.timerDisplay.innerText = `Menghafal jalur: ${waktuMenghafal}`;
          } else if (waktuBermain > 0) {
            izinkanBergerak = true;
            aktifkanBantuan();
            hideWalls();
            waktuBermain--;
            elements.timerDisplay.innerText = `Waktu bermain: ${waktuBermain}`;
          } else if (waktuBermain <= 0) {
            darah--;
            updateDarah();
            waktuBermain = 21;
          } else {
            endGame();
          }
        }, 1000);
      }

      function endGame() {
        simpanSkor();
        showAlert();
      }

      generateMazeGrid();