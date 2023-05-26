/*  abre e fecha o menu quando clicar no icone: hamburguer e x */
const nav = document.querySelector("#header nav")
const toggle = document.querySelectorAll("nav .toggle")

for (const element of toggle) {
  element.addEventListener("click", function () {
    nav.classList.toggle("show")
  })
}

/* quando clicar em um item do menu, esconder o menu */
const links = document.querySelectorAll("nav ul li a")

for (const link of links) {
  link.addEventListener("click", function () {
    nav.classList.remove("show")
  })
}

/* mudar o header da página quando der scroll */
const header = document.querySelector("#header")
const navHeight = header.offsetHeight

/* Menu ativo conforme a seção visível na página */
const sections = document.querySelectorAll("main section[id]")
function activateMenuAtCurrentSection() {
  const checkpoint = window.pageYOffset + (window.innerHeight / 8) * 4

  for (const section of sections) {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    const checkpointStart = checkpoint >= sectionTop
    const checkpointEnd = checkpoint <= sectionTop + sectionHeight

    if (checkpointStart && checkpointEnd) {
      document
        .querySelector("nav ul li a[href*=" + sectionId + "]")
        .classList.add("active")
    } else {
      document
        .querySelector("nav ul li a[href*=" + sectionId + "]")
        .classList.remove("active")
    }
  }
}
