---
title: Go Cheat Sheet
tags: ['Go']
date: 2020-11-19
---

## Go Lang Tour

This post is my cheat sheet for the (Go Lang Tour)[https://tour.golang.org].

Package `main` runs programs.

## Imports

Factored Import Statements

```go
import (
	"fmt"
	"math"
)
```

## Exports

In Go, a name is exported if it begins with a capital letter.

## Functions

```go
func add(x int, y int) int {
	return x + y
}
```

You may omit types if they are equal for consecutive parameters.

```go
func add(x, y int) int {
	return x + y
}
```

### Multiple Results

```go
func swap(x, y string) (string, string) {
	return y, x
}

func main() {
	a, b := swap("hello", "world")
	fmt.Println(a, b)
}
```

### Naked return

```go
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}
```

## Variables

```go
var c, python, java bool
```

Short declaration with `:=`

```go
func main() {
	var i, j int = 1, 2
	k := 3
	c, python, java := true, false, "no!"

	fmt.Println(i, j, k, c, python, java)
}
```

## Datatypes

```go
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // alias for uint8

rune // alias for int32
     // represents a Unicode code point

float32 float64

complex64 complex128
```

# Conditions and Loops

## For

```go
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}
```

## For is Go's While

```go
for sum < 1000 {
    sum += sum
}
```

## Defer

```go
func main() {
	defer fmt.Println("world")

	fmt.Println("hello")
}
```

[Further Reading](https://blog.golang.org/defer-panic-and-recover)

# Examples

Read in line:

```go
func Scanln(a ...interface{}) (n int, err error)
```

Example

```go
var name string
fmt.Scanln(&name)
```

## Life, the Universe, and Everything

Read lines until we read `42`.

```go
package main
import "fmt"

func main(){
	// your code goes here
	var line string
	for fmt.Scanln(&line); line != "42"; fmt.Scanln(&line) {
		fmt.Println(line)
	}
}
```
