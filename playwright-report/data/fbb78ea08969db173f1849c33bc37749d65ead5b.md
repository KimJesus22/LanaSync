# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "Bienvenido" [level=1] [ref=e6]
    - paragraph [ref=e7]: Inicia sesión en Finanzas
  - generic [ref=e8]:
    - button "Continuar con Google" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
      - text: Continuar con Google
    - generic [ref=e19]: O continúa con email
    - generic [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]: Correo electrónico
        - textbox "Correo electrónico" [ref=e23]:
          - /placeholder: tu@email.com
      - generic [ref=e24]:
        - generic [ref=e25]: Contraseña
        - textbox "Contraseña" [ref=e26]:
          - /placeholder: ••••••••
      - button "Iniciar Sesión" [ref=e27] [cursor=pointer]
    - generic [ref=e28]:
      - button "¿No tienes cuenta? Regístrate" [ref=e29] [cursor=pointer]
      - button "Iniciar con Magic Link" [ref=e30] [cursor=pointer]
```