FROM golang:1.23.4-alpine

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY . .

RUN go mod download

CMD ["air", "-c", ".air.toml"]