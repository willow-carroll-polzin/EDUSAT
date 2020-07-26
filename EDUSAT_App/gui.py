#Required Libriaries
from tkinter import *
from tkinter import ttk
from tkinter import scrolledtext, messagebox, filedialog, Menu
from os import path
#from tkinter.ttk import *

###################### GUI Setup ######################
#Initilize the window
window = Tk()

window.title("EDU-SAT System Monitor")
window.geometry('1000x600')
window.iconbitmap(default='transparent.ico')

#lab = Label(window, text='Window with transparent icon.')
#lab.pack()

#Setup style
style = ttk.Style()
style.configure("Blue.TLabel",background="green")

###################### GUI Layout ######################
#       SYSTEM STATUS       #
#Event handlers
def radioClicked():
    print(selected.get())
    res = messagebox.askyesno('Message title','Message content')
    print(res)
    #messagebox.showwarning('Message title', 'Message content')  #shows warning message
    #messagebox.showerror('Message title', 'Message content')    #shows error message

#Setup the labels
lbl = Label(window, text="System Status", font=("Arial Bold", 50))
lbl.grid(column=0, row=0)

#Radio buttons
selected = IntVar()
rad1 = Radiobutton(window,text='First', value=1, variable=selected, command=radioClicked)
rad2 = Radiobutton(window,text='Second', value=2, variable=selected, command=radioClicked)
rad1.grid(column=0, row=1)
rad2.grid(column=1, row=1)

#Scrolled text to display serial monitor
txt = scrolledtext.ScrolledText(window,width=40,height=10)
txt.insert(INSERT,'You text goes here\n\n\n\naaa')
#txt.delete(1.0,END)
txt.grid(column=5,row=2)

#       FILE MANAGER       #
#Event handlers
def clicked():
    input = "Was typed:"+txt.get()
    lbl.configure(text=input)

#Setup buttons
#btn = Button(window, text="Click Me", bg="orange", fg="red", command=clicked)
btn = ttk.Button(window, text="Click Me", style="Blue.TLabel", command=clicked)
btn.grid(column=1, row=0)

#Textbox
txt = Entry(window,width=10)
txt.grid(column=2, row=0)

#Combobox
combo = ttk.Combobox(window)
combo['values']= (1, 2, 3, ".txt", 5, "Text")
combo.current(1) #set the selected item
combo.grid(column=2, row=0)
print(combo.get()) #Get selected item

#File dialog box
def fileSelect():
    dir = filedialog.askdirectory(initialdir= path.dirname(__file__)) #TODO: change init dir
    #file = filedialog.askopenfilename(initialdir="desktop", filetypes = (("Text files","*.txt"),("all files","*.*")))
    dirLBL = Label(window, text=dir, font=("Arial Bold", 12))
    dirLBL.grid(column=0, row=5)
fileSelectBTN = ttk.Button(window, text="File Browser", style="Blue.TLabel", command=fileSelect)
fileSelectBTN.grid(column=0, row=6)

#       GRAPHER       #
#Checkbutton settings
chk_state = BooleanVar()
chk_state.set(True) #set check state
chk = Checkbutton(window, text='Choose')
chk.grid(column=3, row=0)


#       SETTINGS       #
#Menu
menu = Menu(window)

new_item = Menu(menu)

#new_item.add_command(label='New', command=clicked)
new_item.add_command(label='New')

new_item.add_separator()

new_item.add_command(label='Edit')

#new_item = Menu(menu, tearoff=0) #Remove tearoff ability

new_item.add_command(label='New', command=clicked)

#menu.add_command(label='File')

window.config(menu=menu)

menu.add_cascade(label='File', menu=new_item)

#Tab control #TODO: Add mutlptiple frames so .pack can be used (then add widgets to each tab, https://likegeeks.com/python-gui-examples-tkinter-tutorial/)
""" tab_control = ttk.Notebook(window)

tab1 = ttk.Frame(tab_control)

tab_control.add(tab1, text='First')

tab_control.pack(expand=1, fill='both') """

###################### GUI Controls ######################
#Run the window
window.mainloop()

#Update the window
