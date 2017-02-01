CC := lessc
DIR := ./css/
SOURCE := style.less
OBJ := style.min.css
PLUGIN := clean-css

compile:
	$(CC) --$(PLUGIN) $(DIR)$(SOURCE) $(DIR)$(OBJ)
