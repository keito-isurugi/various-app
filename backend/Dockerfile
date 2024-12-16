FROM golang:1.23.4-alpine

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY . .

RUN go mod download \
    && go build -o /app/main /app/cmd/api/main.go

CMD ["air", "-c", ".air.toml"]